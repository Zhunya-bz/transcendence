/*
  Warnings:

  - A unique constraint covering the columns `[forty_two_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "forty_two_id" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_forty_two_id_key" ON "users"("forty_two_id");
