-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'teacher', 'admin');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_secret" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_keys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "roles" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "service_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name_subject" VARCHAR(100) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" SERIAL NOT NULL,
    "name_theme" VARCHAR(100) NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name_course" VARCHAR(100) NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "expert_id" INTEGER,
    "description" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_course_subjects" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "subject_id" INTEGER NOT NULL,
    "expert_id" INTEGER,

    CONSTRAINT "student_course_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "times_solved" INTEGER NOT NULL DEFAULT 0,
    "expert_id" INTEGER NOT NULL DEFAULT 0,
    "max_points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "question_text" VARCHAR(100) NOT NULL,
    "addition_info" TEXT NOT NULL,
    "question_points" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "points_user" INTEGER,
    "score" DOUBLE PRECISION,
    "passing_date" TIMESTAMP(3),

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "id" SERIAL NOT NULL,
    "result_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_answer" INTEGER NOT NULL,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_analytics" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "analyticity" INTEGER NOT NULL DEFAULT 0,
    "leadership" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_analytics_tests" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "analyticity_test" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_analytics_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_analytics_themes" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "analyticity_theme" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_analytics_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_analytics_courses" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "analyticity_course" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_analytics_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_leadership_tests" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "leadership_test" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_leadership_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_leadership_themes" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "leadership_theme" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_leadership_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_leadership_courses" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "leadership_course" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "student_leadership_courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_analytics_student_id_key" ON "student_analytics"("student_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes" ADD CONSTRAINT "themes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course_subjects" ADD CONSTRAINT "student_course_subjects_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_course_subjects" ADD CONSTRAINT "student_course_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_analytics" ADD CONSTRAINT "student_analytics_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_analytics_tests" ADD CONSTRAINT "student_analytics_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_leadership_tests" ADD CONSTRAINT "student_leadership_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
