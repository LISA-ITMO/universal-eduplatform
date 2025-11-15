import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsResolver } from './subjects.resolver';

@Module({
  providers: [SubjectsService, SubjectsResolver],
  exports: [SubjectsService],
})
export class SubjectsModule {}




