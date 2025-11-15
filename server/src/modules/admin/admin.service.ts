import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}




