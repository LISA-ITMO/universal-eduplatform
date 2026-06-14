import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthModule } from '../auth/auth.module';
import { TestsModule } from '../tests/tests.module';
import { BotResolver } from './bot.resolver';

@Module({
  imports: [AuthModule, TestsModule],
  providers: [BotService, BotResolver],
  exports: [BotService],
})
export class BotModule {}
