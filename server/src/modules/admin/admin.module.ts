import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';

@Module({
  providers: [AdminService, AdminResolver],
  exports: [AdminService],
})
export class AdminModule {}




