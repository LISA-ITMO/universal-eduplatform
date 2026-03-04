import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

export interface AuthPayload {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
  };
  requires2FA?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<User | null> {
    const whereClause = identifier.includes('@')
      ? { email: identifier }
      : { username: identifier };

    const user = await this.prisma.user.findFirst({
      where: whereClause,
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<AuthPayload> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      twoFactorPassed: !user.twoFactorEnabled,
    };

    const accessToken = this.jwtService.sign(payload);

  // Create refresh token
  const refreshToken = await this.createRefreshToken(user.id);

    // Update last login
    const now = new Date();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: now },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: (user as any).firstName,
        lastName: (user as any).lastName,
        middleName: (user as any).middleName,
        phone: (user as any).phone,
        lastLogin: now.toISOString(),
      } as any,
      requires2FA: user.twoFactorEnabled,
      // NOTE: refreshToken is intentionally returned here for server-side resolvers
      // that may want to set it as an httpOnly cookie. Do NOT expose this field
      // to GraphQL clients directly.
      // @ts-ignore
      refreshToken,
    } as unknown as AuthPayload;
  }

  async register(
    username: string,
    email: string,
    password: string,
    roleInput?: string,
    firstName?: string,
    lastName?: string,
    middleName?: string,
    phone?: string,
  ): Promise<AuthPayload> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const role: Role = (roleInput && ['student','teacher','admin'].includes(roleInput))
      ? (roleInput as Role)
      : Role.student;

    const user = await this.prisma.user.create({
      // cast to any to avoid transient type issues before prisma client is regenerated
      data: ({
        username,
        email,
        passwordHash,
        role,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        middleName: middleName ?? null,
        phone: phone ?? null,
      } as any),
    });

    return this.login(user);
  }

  async createRefreshToken(userId: number): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const tokenHash = await bcrypt.hash(refreshToken, 10);
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          userId: payload.sub,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found or expired');
      }

      const isTokenValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        twoFactorPassed: !user.twoFactorEnabled,
      });

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revoke refresh token by verifying it and deleting stored tokens for the user.
   * This is a simple approach: after verifying the token we delete all refresh tokens
   * for that user. Optionally we could locate and delete a specific token by hash.
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // payload.sub is userId
      const userId = payload.sub as number;

      // Find non-expired tokens for the user and compare hashes to identify the exact token
      const candidates = await this.prisma.refreshToken.findMany({
        where: { userId, expiresAt: { gt: new Date() } },
      });

      for (const cand of candidates) {
        try {
          const match = await bcrypt.compare(refreshToken, cand.tokenHash);
          if (match) {
            await this.prisma.refreshToken.delete({ where: { id: cand.id } });
            // don't break: there could be duplicates (rare), continue to remove all matches
          }
        } catch (e) {
          // ignore bcrypt errors for individual tokens
        }
      }
    } catch (e) {
      // ignore errors - token may be invalid/expired
    }
  }

  async verify2FA(userId: number, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    return authenticator.verify({ token: code, secret: user.twoFactorSecret });
  }

  async enable2FA(userId: number): Promise<{ secret: string; qrCode: string }> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      'user@example.com', // TODO: Get from user
      'Quiz Platform',
      secret,
    );

    const qrCode = await QRCode.toDataURL(otpAuthUrl);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });

    return { secret, qrCode };
  }

  async disable2FA(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });
  }

  /**
   * Change user password. Does not revoke existing refresh tokens (session is preserved).
   */
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldValid) {
      throw new UnauthorizedException('Неверный старый пароль');
    }

    // Validate complexity: at least 8 chars, at least one digit and one special char
    const complexityRegex = /^(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!complexityRegex.test(newPassword)) {
      throw new BadRequestException('Пароль должен содержать 8 символов, как минимум одну цифру и один спецсимвол');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    // Intentionally do not revoke refresh tokens to keep session alive
  }

  /**
   * Change password by login (used by non-authenticated clients like bots).
   * Validates oldPassword and updates to newPassword (with complexity check).
   */
  async changePasswordByLogin(login: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { username: login } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldValid) {
      throw new UnauthorizedException('Неверный старый пароль');
    }

    const complexityRegex = /^(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!complexityRegex.test(newPassword)) {
      throw new BadRequestException('Пароль должен содержать 8 символов, как минимум одну цифру и один спецсимвол');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
  }
}


