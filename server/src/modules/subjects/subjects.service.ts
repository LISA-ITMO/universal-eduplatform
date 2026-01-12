import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Subject, Theme, Course, StudentCourseSubject, User, Role } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  // Subjects
  async findAllSubjects() {
    return (this.prisma as any).subject.findMany({
      include: { themes: true, courses: true, subjectMaterials: true, expert: true },
    });
  }

  async findSubjectById(id: number) {
    return (this.prisma as any).subject.findUnique({
      where: { id },
      include: { themes: true, courses: true, subjectMaterials: true, expert: true },
    });
  }

  async createSubject(nameSubject: string, expertId?: number) {
    return (this.prisma as any).subject.create({
      data: { nameSubject, expertId },
    });
  }

  // SubjectMaterials
  async addSubjectMaterial(subjectId: number, title: string | undefined, url: string, currentUser?: User) {
    // simple permission: check subject exists and user is admin or assigned expert
  const subject = await (this.prisma as any).subject.findUnique({ where: { id: subjectId } });
    if (!subject) throw new Error('Subject not found');
    if (currentUser && currentUser.role !== Role.admin && subject.expertId !== currentUser.id) {
      throw new ForbiddenException();
    }
    return (this.prisma as any).subjectMaterial.create({ data: { subjectId, title, url } });
  }

  async deleteSubjectMaterial(id: number, currentUser?: User) {
  const material = await (this.prisma as any).subjectMaterial.findUnique({ where: { id } });
    if (!material) return false;
  const subject = await (this.prisma as any).subject.findUnique({ where: { id: material.subjectId } });
    if (!subject) throw new Error('Subject not found');
    if (currentUser && currentUser.role !== Role.admin && subject.expertId !== currentUser.id) {
      throw new ForbiddenException();
    }
    await (this.prisma as any).subjectMaterial.delete({ where: { id } });
    return true;
  }

  // Delete operations with permission checks
  async deleteSubject(id: number, currentUser?: User) {
  const subject = await (this.prisma as any).subject.findUnique({ where: { id } });
    if (!subject) return false;
    if (currentUser && currentUser.role !== Role.admin && subject.expertId !== currentUser.id) {
      throw new ForbiddenException();
    }
    await (this.prisma as any).subject.delete({ where: { id } });
    return true;
  }

  async deleteTheme(id: number, currentUser?: User) {
  const theme = await (this.prisma as any).theme.findUnique({ where: { id } });
    if (!theme) return false;
  const subject = await (this.prisma as any).subject.findUnique({ where: { id: theme.subjectId } });
    if (!subject) throw new Error('Subject not found');
    if (currentUser && currentUser.role !== Role.admin && subject.expertId !== currentUser.id) {
      throw new ForbiddenException();
    }
    await (this.prisma as any).theme.delete({ where: { id } });
    return true;
  }

  async deleteTest(id: number, currentUser?: User) {
  const test = await (this.prisma as any).test.findUnique({ where: { id } });
    if (!test) return false;
  const subject = await (this.prisma as any).subject.findUnique({ where: { id: test.subjectId } });
    if (!subject) throw new Error('Subject not found');
    if (currentUser && currentUser.role !== Role.admin && subject.expertId !== currentUser.id) {
      throw new ForbiddenException();
    }
    await (this.prisma as any).test.delete({ where: { id } });
    return true;
  }

  // Themes
  async findThemesBySubject(subjectId: number) {
    return this.prisma.theme.findMany({
      where: { subjectId },
    });
  }

  async createTheme(nameTheme: string, subjectId: number) {
    return this.prisma.theme.create({
      data: { nameTheme, subjectId },
    });
  }

  // Courses
  async findCoursesBySubject(subjectId: number) {
    return this.prisma.course.findMany({
      where: { subjectId },
      include: { subject: true, expert: true },
    });
  }

  async createCourse(
    nameCourse: string,
    subjectId: number,
    expertId?: number,
    description?: string,
  ) {
    return this.prisma.course.create({
      data: {
        nameCourse,
        subjectId,
        expertId,
        description,
      },
    });
  }

  // Student Course Subjects
  async createStudentCourseSubject(
    studentId: number,
    subjectId: number,
    expertId?: number,
  ) {
    return this.prisma.studentCourseSubject.create({
      data: {
        studentId,
        subjectId,
        expertId,
      },
    });
  }
}




