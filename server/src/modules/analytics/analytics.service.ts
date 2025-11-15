import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentAnalytics(studentId: number) {
    return this.prisma.studentAnalytics.findUnique({
      where: { studentId },
    });
  }

  async getStudentAnalyticsByTest(studentId: number, testId: number) {
    return this.prisma.studentAnalyticsTest.findFirst({
      where: { studentId, testId },
      include: { test: true },
    });
  }

  async getStudentAnalyticsByTheme(studentId: number, themeId: number, subjectId: number) {
    return this.prisma.studentAnalyticsTheme.findFirst({
      where: { studentId, themeId, subjectId },
    });
  }

  async getStudentAnalyticsByCourse(studentId: number, subjectId: number) {
    return this.prisma.studentAnalyticsCourse.findFirst({
      where: { studentId, subjectId },
    });
  }

  async getStudentLeadershipByTest(studentId: number, testId: number) {
    return this.prisma.studentLeadershipTest.findFirst({
      where: { studentId, testId },
      include: { test: true },
    });
  }

  async updateStudentAnalytics(studentId: number, analyticity: number, leadership: number) {
    return this.prisma.studentAnalytics.upsert({
      where: { studentId },
      create: {
        studentId,
        analyticity,
        leadership,
      },
      update: {
        analyticity,
        leadership,
      },
    });
  }

  // ---- Calculation helpers ported from legacy django implementation ----
  private median(values: number[]) {
    if (!values || values.length === 0) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
  }

  async calculateAnalyticityTest(studentId: number, testId: number) {
    // load test and questions so we can compute total max points even if test.maxPoints is not set
    const test = await this.prisma.test.findUnique({ where: { id: testId }, include: { questions: { select: { questionPoints: true } } } });
    if (!test) return 0;

    // take latest result for this student and test
    const result = await this.prisma.result.findFirst({
      where: { userId: studentId, testId },
      orderBy: { passingDate: 'desc' },
    });
    if (!result) return 0;

    // derive total max points: prefer explicit test.maxPoints, otherwise sum question.questionPoints
    const totalMaxPointsFromQuestions = test.questions?.reduce((s, q) => s + (q.questionPoints ?? 0), 0) ?? 0;
    const totalMaxPoints = (test.maxPoints && test.maxPoints > 0) ? test.maxPoints : totalMaxPointsFromQuestions;
    if (totalMaxPoints === 0) return 0;

    const pointsUser = result.pointsUser ?? 0;
    const analyticityTest = Math.round((pointsUser / totalMaxPoints) * 100);

    // upsert per-student per-test analyticity
    const existing = await this.prisma.studentAnalyticsTest.findFirst({ where: { studentId, testId } });
    if (existing) {
      await this.prisma.studentAnalyticsTest.update({ where: { id: existing.id }, data: { analyticityTest } });
    } else {
      await this.prisma.studentAnalyticsTest.create({ data: { studentId, testId, analyticityTest } });
    }

    return analyticityTest;
  }

  async calculateAnalyticityTheme(studentId: number, themeId: number, subjectId: number) {
    const tests = await this.prisma.test.findMany({ where: { themeId, subjectId }, select: { id: true } });
    const testIds = tests.map((t) => t.id);
    const values = await this.prisma.studentAnalyticsTest.findMany({ where: { studentId, testId: { in: testIds } }, select: { analyticityTest: true } });
    const nums = values.map((v) => v.analyticityTest);
    const analyticityTheme = this.median(nums);

    const existing = await this.prisma.studentAnalyticsTheme.findFirst({ where: { studentId, themeId, subjectId } });
    if (existing) {
      await this.prisma.studentAnalyticsTheme.update({ where: { id: existing.id }, data: { analyticityTheme } });
    } else {
      await this.prisma.studentAnalyticsTheme.create({ data: { studentId, themeId, subjectId, analyticityTheme } });
    }

    return analyticityTheme;
  }

  async calculateAnalyticityCourse(studentId: number, subjectId: number) {
    const tests = await this.prisma.test.findMany({ where: { subjectId }, select: { id: true } });
    const testIds = tests.map((t) => t.id);
    const values = await this.prisma.studentAnalyticsTest.findMany({ where: { studentId, testId: { in: testIds } }, select: { analyticityTest: true } });
    const nums = values.map((v) => v.analyticityTest);
    const analyticityCourse = this.median(nums);

    const existing = await this.prisma.studentAnalyticsCourse.findFirst({ where: { studentId, subjectId } });
    if (existing) {
      await this.prisma.studentAnalyticsCourse.update({ where: { id: existing.id }, data: { analyticityCourse } });
    } else {
      await this.prisma.studentAnalyticsCourse.create({ data: { studentId, subjectId, analyticityCourse } });
    }

    return analyticityCourse;
  }

  // Leadership: ported logic from legacy code
  async calculateLeadershipTest(studentId: number, testId: number) {
    // gather all students' analyticityTest for this test
    const scores = await this.prisma.studentAnalyticsTest.findMany({ where: { testId }, select: { analyticityTest: true } });
    const nums = scores.map((s) => s.analyticityTest).sort((a, b) => a - b);
    if (nums.length < 4) return 0;
    const max = nums[nums.length - 1];
    const scoresNew = nums.filter((score) => score !== 0 && score !== max);
    const leadership = Math.round((scoresNew.length / nums.length) * 100);

    const existing = await this.prisma.studentLeadershipTest.findFirst({ where: { studentId, testId } });
    if (existing) {
      await this.prisma.studentLeadershipTest.update({ where: { id: existing.id }, data: { leadershipTest: leadership } });
    } else {
      await this.prisma.studentLeadershipTest.create({ data: { studentId, testId, leadershipTest: leadership } });
    }

    return leadership;
  }

  async calculateLeadershipTheme(studentId: number, themeId: number, subjectId: number) {
    const tests = await this.prisma.test.findMany({ where: { themeId, subjectId }, select: { id: true } });
    const testIds = tests.map((t) => t.id);
    const values = await this.prisma.studentLeadershipTest.findMany({ where: { studentId, testId: { in: testIds } }, select: { leadershipTest: true } });
    if (values.length === 0) return 0;
    const leadershipTheme = Math.round(values.reduce((s, v) => s + v.leadershipTest, 0) / values.length);

    const existing = await this.prisma.studentLeadershipTheme.findFirst({ where: { studentId, themeId, subjectId } });
    if (existing) {
      await this.prisma.studentLeadershipTheme.update({ where: { id: existing.id }, data: { leadershipTheme } });
    } else {
      await this.prisma.studentLeadershipTheme.create({ data: { studentId, themeId, subjectId, leadershipTheme } });
    }

    return leadershipTheme;
  }

  async calculateLeadershipCourse(studentId: number, subjectId: number) {
    const tests = await this.prisma.test.findMany({ where: { subjectId }, select: { id: true } });
    const testIds = tests.map((t) => t.id);
    const values = await this.prisma.studentLeadershipTest.findMany({ where: { studentId, testId: { in: testIds } }, select: { leadershipTest: true } });
    if (values.length === 0) return 0;
    const leadershipCourse = Math.round(values.reduce((s, v) => s + v.leadershipTest, 0) / values.length);

    const existing = await this.prisma.studentLeadershipCourse.findFirst({ where: { studentId, subjectId } });
    if (existing) {
      await this.prisma.studentLeadershipCourse.update({ where: { id: existing.id }, data: { leadershipCourse } });
    } else {
      await this.prisma.studentLeadershipCourse.create({ data: { studentId, subjectId, leadershipCourse } });
    }

    return leadershipCourse;
  }

  // Compute overall analyticity and leadership for student (simple aggregates)
  async computeOverallAnalytics(studentId: number) {
    const testAnalytList = await this.prisma.studentAnalyticsTest.findMany({ where: { studentId }, select: { analyticityTest: true } });
    const analytValues = testAnalytList.map((t) => t.analyticityTest);
    const analyticity = this.median(analytValues);

    const leadList = await this.prisma.studentLeadershipTest.findMany({ where: { studentId }, select: { leadershipTest: true } });
    const leadValues = leadList.map((t) => t.leadershipTest);
    const leadership = leadValues.length === 0 ? 0 : Math.round(leadValues.reduce((s, v) => s + v, 0) / leadValues.length);

    await this.updateStudentAnalytics(studentId, analyticity, leadership);

    return { analyticity, leadership };
  }
}




