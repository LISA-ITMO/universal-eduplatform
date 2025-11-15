import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ANALYTICS_QUEUE, AnalyticsJobPayload } from './analytics.queue';
import { PrismaService } from '../../prisma/prisma.service';

@Processor(ANALYTICS_QUEUE)
@Injectable()
export class AnalyticsProcessor {
  constructor(private analyticsService: AnalyticsService, private prisma: PrismaService) {}

  @Process('calculate')
  async handleCalculate(job: Job<AnalyticsJobPayload>) {
    const { userId, testId } = job.data;
    try {
      await this.analyticsService.calculateAnalyticityTest(userId, testId);

      const test = await this.prisma.test.findUnique({ where: { id: testId }, select: { themeId: true, subjectId: true } });

      const themeId = test?.themeId ?? 0;
      const subjectId = test?.subjectId ?? 0;

      await this.analyticsService.calculateAnalyticityTheme(userId, themeId, subjectId);
      await this.analyticsService.calculateAnalyticityCourse(userId, subjectId);

      await this.analyticsService.calculateLeadershipTest(userId, testId);
      await this.analyticsService.calculateLeadershipTheme(userId, themeId, subjectId);
      await this.analyticsService.calculateLeadershipCourse(userId, subjectId);

      await this.analyticsService.computeOverallAnalytics(userId);
    } catch (e) {
      // log and rethrow so Bull can handle retries if configured
      // eslint-disable-next-line no-console
      console.error('Analytics job failed', e);
      throw e;
    }
  }
}
