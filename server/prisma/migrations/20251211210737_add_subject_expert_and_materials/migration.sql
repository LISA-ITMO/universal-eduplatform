-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "expert_id" INTEGER;

-- CreateTable
CREATE TABLE "subject_materials" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_materials" ADD CONSTRAINT "subject_materials_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
