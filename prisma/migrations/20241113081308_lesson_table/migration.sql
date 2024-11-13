/*
  Warnings:

  - Added the required column `lessonTitle` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `lessonTitle` VARCHAR(191) NOT NULL;
