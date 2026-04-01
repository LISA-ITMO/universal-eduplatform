import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Test } from './entities/test.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { PublicTest } from './entities/public-test.entity';
import { PublicQuestion } from './entities/public-question.entity';
import { PublicAnswer } from './entities/public-answer.entity';
import { Result } from './entities/result.entity';
import { SolutionInput } from './entities/solution.entity';

@Resolver(() => Test)
export class TestsResolver {
  constructor(private testsService: TestsService) {}

  @Query(() => PublicTest)
  async test(@Args('id', { type: () => Int }) id: number) {
    const t = await this.testsService.findTestById(id);
    if (!t) return null;

    // Map questions and answers to public shape (remove isCorrect)
    const publicQuestions = (t.questions || []).map((q: any) => {
      const publicAnswers = (q.answers || []).map((a: any) => ({
        id: a.id,
        questionId: a.questionId,
        answerText: a.answerText,
        __typename: 'PublicAnswer',
      }));
      return {
        id: q.id,
        testId: q.testId,
        questionText: q.questionText,
        additionInfo: q.additionInfo,
        questionPoints: q.questionPoints,
        answers: publicAnswers,
        __typename: 'PublicQuestion',
      };
    });

    const tt: any = t as any;
    const publicTest: any = {
      id: tt.id,
      name: tt.name,
      authorId: tt.authorId,
      author: tt.author,
      subjectId: tt.subjectId,
      subject: tt.subject,
      themeId: tt.themeId,
      theme: tt.theme,
      timesSolved: tt.timesSolved,
      expertId: tt.expertId,
      maxPoints: tt.maxPoints,
      questionsCount: (tt.questions || []).length,
      questions: publicQuestions,
      __typename: 'PublicTest',
    };

    return publicTest;
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
    @Args('name', { nullable: true }) name?: string,
    @Args('expertId', { nullable: true, type: () => Int }) expertId?: number,
  ) {
    return this.testsService.createTest({
      authorId: user.id,
      subjectId,
      themeId,
      name,
      expertId,
      maxPoints,
    });
  }

  // Resolve computed field questionsCount
  @ResolveField(() => Int)
  async questionsCount(@Parent() test: Test) {
    // if questions are already included, use length
    // @ts-ignore
    if (test.questions) return (test.questions as any[]).length;
    return this.testsService.countQuestions(test.id);
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

