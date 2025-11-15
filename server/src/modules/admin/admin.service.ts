import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface CreateUserData {
  username: string;
  email?: string;
  password: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  phone?: string | null;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        testsCreated: true,
        testsSolved: true,
      },
    });
  }

  async getAllTests() {
    return this.prisma.test.findMany({
      include: {
        author: true,
        subject: true,
        theme: true,
        results: true,
      },
    });
  }

  async getAuditLogs(skip?: number, take?: number) {
    return this.prisma.auditLog.findMany({
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(data: CreateUserData) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    // Ensure email is unique non-empty string (DB requires non-null unique email).
    // If admin didn't provide email, fabricate one from username to avoid
    // violating unique constraint on empty string for multiple users.
    const emailToUse = data.email && data.email.trim() !== '' ? data.email : `${data.username}@no-reply.local`;

    try {
      return await this.prisma.user.create({
        data: {
          username: data.username,
          email: emailToUse,
          passwordHash,
          role: data.role as any,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          middleName: data.middleName ?? null,
          phone: data.phone ?? null,
        } as any,
      });
    } catch (err: any) {
      // Map Prisma unique constraint error to a friendlier message
      if (err?.code === 'P2002') {
        // Unique constraint failed - determine target
        const target = err?.meta?.target || 'value';
        throw new Error(`Unique constraint failed: ${target}`);
      }
      throw err;
    }
  }
}




