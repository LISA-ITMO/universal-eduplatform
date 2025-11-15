import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.user.findMany({
      skip,
      take,
    });
  }

  async findAndCount(options: {
    skip?: number;
    take?: number;
    search?: string;
    orderByField?: string;
    orderByDirection?: 'asc' | 'desc';
    roleFilter?: string | undefined;
  }) {
    const { skip, take, search, orderByField, orderByDirection } = options;

    const where: any = {};
    if (options.roleFilter) {
      where.role = options.roleFilter;
    }
    if (search && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { lastName: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { middleName: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (orderByField) {
      // guard against invalid fields in a best-effort way
      const allowed = ['lastName', 'firstName', 'middleName', 'username', 'email', 'phone', 'role', 'lastLogin'];
      if (allowed.includes(orderByField)) {
        orderBy[orderByField] = orderByDirection === 'desc' ? 'desc' : 'asc';
      }
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.user.findMany({ where: Object.keys(where).length ? where : undefined, skip, take, orderBy: Object.keys(orderBy).length ? orderBy : undefined }),
      this.prisma.user.count({ where: Object.keys(where).length ? where : undefined }),
    ]);

    return { items, totalCount };
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}




