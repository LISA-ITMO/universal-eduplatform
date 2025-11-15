import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsResolver } from './tests.resolver';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  providers: [TestsService, TestsResolver],
  exports: [TestsService],
})
export class TestsModule {}




