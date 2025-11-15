import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Role } from '@prisma/client';

import { UserType } from '../../modules/auth/auth.resolver';


@ObjectType()
export class UsersPage {
  @Field(() => [UserType])
  items: UserType[];

  @Field(() => Int)
  totalCount: number;
}

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserType, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User): Promise<UserType> {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      middleName: (user as any).middleName,
      phone: (user as any).phone,
      lastLogin: (user as any).lastLogin ? (user as any).lastLogin.toISOString() : null,
    } as any;
  }

  @Query(() => [UserType], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  async findAllUsers(
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('take', { nullable: true, type: () => Int }) take?: number,
  ): Promise<UserType[]> {
    const users = await this.usersService.findAll(skip, take);
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      firstName: (u as any).firstName,
      lastName: (u as any).lastName,
      middleName: (u as any).middleName,
      phone: (u as any).phone,
      lastLogin: (u as any).lastLogin ? (u as any).lastLogin.toISOString() : null,
    } as any));
  }

  @Query(() => UsersPage, { name: 'usersPage' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.teacher)
  async usersPage(
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('take', { nullable: true, type: () => Int }) take?: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('orderByField', { nullable: true }) orderByField?: string,
    @Args('orderByDirection', { nullable: true }) orderByDirection?: string,
    @CurrentUser() currentUser?: User,
  ): Promise<UsersPage> {
    const roleFilter = currentUser?.role === Role.teacher ? Role.student : undefined;
    const { items, totalCount } = await this.usersService.findAndCount({ skip, take, search, orderByField, orderByDirection: (orderByDirection as any), roleFilter });
    return {
      items: items.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        firstName: (u as any).firstName,
        lastName: (u as any).lastName,
        middleName: (u as any).middleName,
        phone: (u as any).phone,
        lastLogin: (u as any).lastLogin ? (u as any).lastLogin.toISOString() : null,
      } as any)),
      totalCount,
    } as UsersPage;
  }

  @Query(() => UserType, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async findUser(@Args('id', { type: () => Int }) id: number): Promise<UserType | null> {
    const user = await this.usersService.findById(id);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      middleName: (user as any).middleName,
      phone: (user as any).phone,
      lastLogin: (user as any).lastLogin ? (user as any).lastLogin.toISOString() : null,
    } as any;
  }
}

