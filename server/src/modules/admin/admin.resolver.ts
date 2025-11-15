import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UserType } from '../../modules/auth/auth.resolver';
import { Test } from '../tests/entities/test.entity';
import { AuditLog } from './entities/audit-log.entity';

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
}

