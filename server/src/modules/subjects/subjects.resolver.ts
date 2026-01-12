import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Subject } from './entities/subject.entity';
import { Theme } from './entities/theme.entity';
import { Course } from './entities/course.entity';
import { SubjectMaterial } from './entities/subject-material.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

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
  @Roles(Role.admin, Role.teacher)
  async createSubject(
    @Args('nameSubject') nameSubject: string,
    @Args('expertId', { nullable: true, type: () => Int }) expertId?: number,
    @CurrentUser() currentUser?: User,
  ) {
    // If teacher creates a subject and doesn't pass expertId, set them as expert
    const resolvedExpertId = currentUser?.role === Role.teacher && !expertId ? currentUser.id : expertId;
    return this.subjectsService.createSubject(nameSubject, resolvedExpertId);
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

  @Mutation(() => SubjectMaterial)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async addSubjectMaterial(
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('url') url: string,
    @Args('title', { nullable: true }) title?: string,
    @CurrentUser() currentUser?: User,
  ) {
    return this.subjectsService.addSubjectMaterial(subjectId, title, url, currentUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async deleteSubjectMaterial(@Args('id', { type: () => Int }) id: number, @CurrentUser() currentUser?: User) {
    return this.subjectsService.deleteSubjectMaterial(id, currentUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async deleteSubject(@Args('id', { type: () => Int }) id: number, @CurrentUser() currentUser?: User) {
    return this.subjectsService.deleteSubject(id, currentUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async deleteTheme(@Args('id', { type: () => Int }) id: number, @CurrentUser() currentUser?: User) {
    return this.subjectsService.deleteTheme(id, currentUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin, Role.teacher)
  async deleteTest(@Args('id', { type: () => Int }) id: number, @CurrentUser() currentUser?: User) {
    return this.subjectsService.deleteTest(id, currentUser);
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

