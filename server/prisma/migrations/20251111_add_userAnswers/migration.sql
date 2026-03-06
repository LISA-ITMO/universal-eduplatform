-- Migration: add userAnswers jsonb column to solutions
-- Run with: npx prisma migrate deploy (or prisma migrate dev)

ALTER TABLE "solutions" ADD COLUMN IF NOT EXISTS "user_answers" JSONB;
