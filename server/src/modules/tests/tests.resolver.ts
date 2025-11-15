import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Test } from './entities/test.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Result } from './entities/result.entity';
import { SolutionInput } from './entities/solution.entity';

@Resolver()
export class TestsResolver {
  constructor(private testsService: TestsService) {}

  @Query(() => Test)
  async test(@Args('id', { type: () => Int }) id: number) {
    return this.testsService.findTestById(id);
  }

  @Query(() => [Test])
  async testsByAuthor(@Args('authorId', { type: () => Int }) authorId: number) {
    return this.testsService.findTestsByAuthor(authorId);
  }

  @Query(() => [Test])
  async testsBySubjectAndTheme(
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('themeId', { type: () => Int }) themeId: number,
  ) {
    return this.testsService.findTestsBySubjectAndTheme(subjectId, themeId);
  }

  @Mutation(() => Test)
  @UseGuards(JwtAuthGuard)
  async createTest(
    @CurrentUser() user: User,
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('themeId', { type: () => Int }) themeId: number,
    @Args('maxPoints') maxPoints: number,
    @Args('expertId', { nullable: true, type: () => Int }) expertId?: number,
  ) {
    return this.testsService.createTest({
      authorId: user.id,
      subjectId,
      themeId,
      expertId,
      maxPoints,
    });
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  async createQuestion(
    @Args('testId', { type: () => Int }) testId: number,
    @Args('questionText') questionText: string,
    @Args('additionInfo') additionInfo: string,
    @Args('questionPoints') questionPoints: number,
  ) {
    return this.testsService.createQuestion({
      testId,
      questionText,
      additionInfo,
      questionPoints,
    });
  }

  @Mutation(() => Answer)
  @UseGuards(JwtAuthGuard)
  async createAnswer(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('answerText') answerText: string,
    @Args('isCorrect') isCorrect: boolean,
  ) {
    return this.testsService.createAnswer({
      questionId,
      answerText,
      isCorrect,
    });
  }

  @Mutation(() => Result)
  @UseGuards(JwtAuthGuard)
  async submitTestResult(
    @CurrentUser() user: User,
    @Args('testId', { type: () => Int }) testId: number,
    @Args('subject') subject: string,
    @Args('theme') theme: string,
    @Args('solutions', { type: () => [SolutionInput] }) solutions: SolutionInput[],
  ) {
    // Server computes pointsUser and score based on correct answers
    return this.testsService.submitTestResult({
      userId: user.id,
      testId,
      subject,
      theme,
      solutions: solutions.map((s) => ({
        questionId: s.questionId,
        userAnswers: s.userAnswers,
      })),
    });
  }

  @Query(() => [Result])
  @UseGuards(JwtAuthGuard)
  async myResults(@CurrentUser() user: User) {
    return this.testsService.getUserResults(user.id);
  }
}

