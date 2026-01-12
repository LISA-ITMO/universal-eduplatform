import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { StudentAnalytics } from './entities/student-analytics.entity';
import { StudentAnalyticsTest } from './entities/student-analytics-test.entity';
import { StudentThemeAnalytics } from './entities/student-theme-analytics.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => StudentAnalytics)
  @UseGuards(JwtAuthGuard)
  async myAnalytics(@CurrentUser() user: User) {
    return this.analyticsService.getStudentAnalytics(user.id);
  }

  @Query(() => StudentAnalyticsTest)
  @UseGuards(JwtAuthGuard)
  async analyticsByTest(
    @CurrentUser() user: User,
    @Args('testId', { type: () => Int }) testId: number,
  ) {
    return this.analyticsService.getStudentAnalyticsByTest(user.id, testId);
  }

  @Query(() => [StudentThemeAnalytics])
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async analyticsByTheme(
    @CurrentUser() user: User,
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('themeId', { type: () => Int }) themeId: number,
  ) {
    // If teacher, ensure the subject belongs to them
    if (user.role === Role.teacher) {
      const subject: any = await (this.analyticsService as any).prisma.subject.findUnique({ where: { id: subjectId } });
      if (!subject) throw new ForbiddenException('Subject not found');
      if (subject.expertId !== user.id) throw new ForbiddenException();
    }
    return this.analyticsService.getAnalyticsByTheme(user.id, subjectId, themeId);
  }
}

