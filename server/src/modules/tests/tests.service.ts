import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, Question, Answer, Result, Solution } from '@prisma/client';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class TestsService {
  // constructor replaced later to also inject AnalyticsService

  async createTest(data: {
    authorId: number;
    subjectId: number;
    themeId: number;
    name?: string;
    expertId?: number;
    maxPoints: number;
  }) {
    // Prisma nested create/connect pattern: connect relations by id instead of
    // passing foreign key scalars directly in `data` to satisfy generated types.
    const createData: any = {
      name: data.name ?? '',
      maxPoints: data.maxPoints,
      // connect required relations
      author: { connect: { id: data.authorId } },
      subject: { connect: { id: data.subjectId } },
      theme: { connect: { id: data.themeId } },
    };

    // expertId is optional - if present and non-zero, set scalar field or connect if needed
    if (typeof data.expertId === 'number' && data.expertId > 0) {
      // there is an `expertId` scalar field in the model so we can set it directly
      createData.expertId = data.expertId;
    }

    return this.prisma.test.create({ data: createData });
  }

  async findTestById(id: number) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
        },
        author: true,
        subject: true,
        theme: true,
      },
    });
  }

  async findTestsByAuthor(authorId: number) {
    return this.prisma.test.findMany({
      where: { authorId },
      include: {
        subject: true,
        theme: true,
        questions: { select: { id: true } },
        author: { select: { id: true, username: true, firstName: true, lastName: true } },
      },
    });
  }

  async findTestsBySubjectAndTheme(subjectId: number, themeId: number) {
    return this.prisma.test.findMany({
      where: {
        subjectId,
        themeId,
      },
      include: {
        subject: true,
        theme: true,
        questions: { select: { id: true } },
        author: { select: { id: true, username: true, firstName: true, lastName: true } },
      },
    });
  }

  async countQuestions(testId: number) {
    return this.prisma.question.count({ where: { testId } });
  }

  async createQuestion(data: {
    testId: number;
    questionText: string;
    additionInfo: string;
    questionPoints: number;
  }) {
    return this.prisma.question.create({
      data,
    });
  }

  async createAnswer(data: {
    questionId: number;
    answerText: string;
    isCorrect: boolean;
  }) {
    return this.prisma.answer.create({
      data,
    });
  }

  constructor(private prisma: PrismaService, private analyticsService: AnalyticsService) {}

  async submitTestResult(data: {
    userId: number;
    testId: number;
    subject: string;
    theme: string;
    solutions: { questionId: number; userAnswers: number[] }[];
  }) {
    // Load test with questions and answers to compute correctness
    const test = await this.prisma.test.findUnique({
      where: { id: data.testId },
      include: {
        questions: { include: { answers: true } },
      },
    });

    if (!test) throw new Error('Test not found');

    let pointsUser = 0;

    // Map solutions by questionId for quick lookup
    const solutionsMap = new Map<number, number[]>();
    for (const s of data.solutions) {
      solutionsMap.set(s.questionId, s.userAnswers || []);
    }

    for (const question of test.questions) {
      const correctAnswers = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id)
        .sort((x, y) => x - y);

      const userAnswers = (solutionsMap.get(question.id) || []).slice().sort((x, y) => x - y);

      const isCorrect =
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((id, idx) => id === userAnswers[idx]);

      if (isCorrect) {
        pointsUser += question.questionPoints;
      }
    }

    const score = test.maxPoints ? (pointsUser / test.maxPoints) * 100 : 0;

    const result = await this.prisma.result.create({
      data: {
        userId: data.userId,
        testId: data.testId,
        subject: data.subject,
        theme: data.theme,
        pointsUser,
        score,
        passingDate: new Date(),
        solutions: {
          create: data.solutions.map((s) => ({
            questionId: s.questionId,
            // store first selected answer (legacy DB field is Int)
            userAnswer: (s.userAnswers && s.userAnswers[0]) || 0,
            // store full array of selected answers as JSON
            userAnswers: s.userAnswers || [],
          })),
        },
      },
      include: { solutions: true },
    });

    // Update test times solved
    await this.prisma.test.update({
      where: { id: data.testId },
      data: {
        timesSolved: { increment: 1 },
      },
    });

    // Update analytics (calculate per-test/theme/course and overall)
    try {
      await this.analyticsService.calculateAnalyticityTest(data.userId, data.testId);
      const testMeta = await this.prisma.test.findUnique({ where: { id: data.testId }, select: { themeId: true, subjectId: true } });
      if (testMeta) {
        const themeId = testMeta.themeId;
        const subjectId = testMeta.subjectId;

        await this.analyticsService.calculateAnalyticityTheme(data.userId, themeId, subjectId);
        await this.analyticsService.calculateAnalyticityCourse(data.userId, subjectId);

        await this.analyticsService.calculateLeadershipTest(data.userId, data.testId);
        await this.analyticsService.calculateLeadershipTheme(data.userId, themeId, subjectId);
        await this.analyticsService.calculateLeadershipCourse(data.userId, subjectId);
      } else {
        // fallback: still compute per-test leadership if test meta is unexpectedly missing
        await this.analyticsService.calculateLeadershipTest(data.userId, data.testId);
      }

      // compute overall student analytics and update top-level record
      await this.analyticsService.computeOverallAnalytics(data.userId);
    } catch (e) {
      // don't block result creation on analytics errors, but log to console
      // eslint-disable-next-line no-console
      console.error('Analytics update failed', e);
    }

    return result;
  }

  async getUserResults(userId: number) {
    return this.prisma.result.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { passingDate: 'desc' },
    });
  }
}

