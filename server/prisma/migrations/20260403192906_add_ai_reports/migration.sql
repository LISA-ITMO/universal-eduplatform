-- CreateTable
CREATE TABLE "ai_reports" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "bot_user_id" INTEGER,
    "payload" JSONB,
    "result_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_bot_user_id_fkey" FOREIGN KEY ("bot_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE SET NULL ON UPDATE CASCADE;
