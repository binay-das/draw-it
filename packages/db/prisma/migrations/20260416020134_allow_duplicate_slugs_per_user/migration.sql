/*
  Warnings:

  - A unique constraint covering the columns `[adminId,slug]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Room_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Room_adminId_slug_key" ON "Room"("adminId", "slug");
