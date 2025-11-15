import { Resolver, Mutation, Args, ObjectType, Field, Context } from '@nestjs/graphql';
import { AuthService, AuthPayload } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ObjectType()
export class UserType {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthPayloadType {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;

  @Field({ nullable: true })
  requires2FA?: boolean;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayloadType)
  async login(@Args('input') input: LoginInput, @Context() ctx): Promise<AuthPayload> {
    // Login supports either email or username via 'identifier'
    const user = await this.authService.validateUser(input.identifier, input.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = await this.authService.login(user);

    // Set refresh token as httpOnly cookie on the response. The refresh token
    // itself is not exposed to GraphQL clients in the response body.
    // Use secure cookie settings; adjust sameSite/origin per deployment needs.
    // Try to read refreshToken returned by the service (it's not part of GraphQL type).
    // @ts-ignore
    const refreshToken = (payload as any).refreshToken;
    if (ctx && ctx.res && refreshToken) {
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms - keep in sync with REFRESH_TOKEN_EXPIRES_IN
      ctx.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
      });
    }

    // Return payload without exposing refreshToken in GraphQL response
    // Build a new object excluding refreshToken
    const { refreshToken: _rt, ...rest } = payload as any;
    return rest as AuthPayload;
  }

    @Mutation(() => Boolean)
    async logout(@Context() ctx): Promise<boolean> {
      // If refresh token cookie is present, try to revoke it server-side
      let cookieToken: string | undefined = undefined;
      if (ctx && ctx.req && ctx.req.cookies) {
        cookieToken = ctx.req.cookies['refreshToken'];
      }

      if (cookieToken) {
        try {
          await this.authService.revokeRefreshToken(cookieToken);
        } catch (e) {
          // ignore
        }
      }

      // Clear refresh token cookie on the client
      if (ctx && ctx.res) {
        ctx.res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }

      return true;
    }

  @Mutation(() => AuthPayloadType)
  async register(@Args('input') input: RegisterInput, @Context() ctx): Promise<AuthPayload> {
    const payload = await this.authService.register(input.username, input.email, input.password, input.role);

    // Set refresh token cookie as in login
    // @ts-ignore
    const refreshToken = (payload as any).refreshToken;
    if (ctx && ctx.res && refreshToken) {
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      ctx.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
      });
    }

    const { refreshToken: _rt, ...rest } = payload as any;
    return rest as AuthPayload;
  }

  @Mutation(() => String)
  async refreshToken(
    @Args('refreshToken', { nullable: true }) refreshToken: string,
    @Context() ctx,
  ): Promise<string> {
    // If client didn't provide refresh token explicitly, try to read it from cookie
    if (!refreshToken && ctx && ctx.req && ctx.req.cookies) {
      refreshToken = ctx.req.cookies['refreshToken'];
    }

    if (!refreshToken) {
      throw new Error('Refresh token not provided');
    }

    return this.authService.refreshAccessToken(refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async verify2FA(
    @CurrentUser() user: User,
    @Args('code') code: string,
  ): Promise<boolean> {
    return this.authService.verify2FA(user.id, code);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser() user: User): Promise<string> {
    const result = await this.authService.enable2FA(user.id);
    return result.qrCode;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async disable2FA(@CurrentUser() user: User): Promise<boolean> {
    await this.authService.disable2FA(user.id);
    return true;
  }
}
