import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Subject } from './entities/subject.entity';
import { Theme } from './entities/theme.entity';
import { Course } from './entities/course.entity';

@Resolver()
export class SubjectsResolver {
  constructor(private subjectsService: SubjectsService) {}

  @Query(() => [Subject])
  async subjects() {
    return this.subjectsService.findAllSubjects();
  }

  @Query(() => Subject)
  async subject(@Args('id', { type: () => Int }) id: number) {
    return this.subjectsService.findSubjectById(id);
  }

  @Mutation(() => Subject)
  @UseGuards(JwtAuthGuard)
  async createSubject(@Args('nameSubject') nameSubject: string) {
    return this.subjectsService.createSubject(nameSubject);
  }

  @Query(() => [Theme])
  async themesBySubject(@Args('subjectId', { type: () => Int }) subjectId: number) {
    return this.subjectsService.findThemesBySubject(subjectId);
  }

  @Mutation(() => Theme)
  @UseGuards(JwtAuthGuard)
  async createTheme(
    @Args('nameTheme') nameTheme: string,
    @Args('subjectId', { type: () => Int }) subjectId: number,
  ) {
    return this.subjectsService.createTheme(nameTheme, subjectId);
  }

  @Query(() => [Course])
  async coursesBySubject(@Args('subjectId', { type: () => Int }) subjectId: number) {
    return this.subjectsService.findCoursesBySubject(subjectId);
  }

  @Mutation(() => Course)
  @UseGuards(JwtAuthGuard)
  async createCourse(
    @Args('nameCourse') nameCourse: string,
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('expertId', { nullable: true, type: () => Int }) expertId?: number,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.subjectsService.createCourse(nameCourse, subjectId, expertId, description);
  }
}

