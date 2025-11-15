import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Subject, Theme, Course, StudentCourseSubject } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  // Subjects
  async findAllSubjects() {
    return this.prisma.subject.findMany({
      include: { themes: true, courses: true },
    });
  }

  async findSubjectById(id: number) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: { themes: true, courses: true },
    });
  }

  async createSubject(nameSubject: string) {
    return this.prisma.subject.create({
      data: { nameSubject },
    });
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




