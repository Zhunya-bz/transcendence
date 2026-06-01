/*
  Warnings:

  - You are about to drop the column `reported_id` on the `issues` table. All the data in the column will be lost.
  - Added the required column `reporter_id` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_reported_id_fkey";

-- AlterTable
ALTER TABLE "issues" DROP COLUMN "reported_id",
ADD COLUMN     "reporter_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
