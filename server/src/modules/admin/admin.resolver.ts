import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { UserType } from '../../modules/auth/auth.resolver';
import { Test } from '../tests/entities/test.entity';
import { AuditLog } from './entities/audit-log.entity';
import { CreateUserInput } from './dto/create-user.input';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async allUsers() {
    return this.adminService.getAllUsers();
  }

  @Query(() => [Test])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async allTests() {
    return this.adminService.getAllTests();
  }

  @Query(() => [AuditLog])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async auditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.teacher)
  async createUser(@Args('input') input: CreateUserInput, @CurrentUser() user: User) {
    // Teachers can only create students
    if (user.role === Role.teacher && input.role !== 'student') {
      throw new Error('Teachers can only create student users');
    }

    const created = await this.adminService.createUser({
      username: input.username,
      email: input.email,
      password: input.password,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName,
      phone: input.phone,
    });

    return {
      id: created.id,
      username: created.username,
      email: created.email,
      role: created.role,
      firstName: (created as any).firstName,
      lastName: (created as any).lastName,
      middleName: (created as any).middleName,
      phone: (created as any).phone,
      lastLogin: (created as any).lastLogin ? (created as any).lastLogin.toISOString() : null,
    } as any;
  }
}

