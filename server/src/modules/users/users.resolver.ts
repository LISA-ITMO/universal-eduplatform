import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Role } from '@prisma/client';
import { UserType } from '../../modules/auth/auth.resolver';

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
    };
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
    }));
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
    };
  }
}

