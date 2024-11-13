/*
  Warnings:

  - A unique constraint covering the columns `[testId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Question_testId_key` ON `Question`(`testId`);
