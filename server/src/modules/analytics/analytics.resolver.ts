import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { StudentAnalytics } from './entities/student-analytics.entity';
import { StudentAnalyticsTest } from './entities/student-analytics-test.entity';

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
}

