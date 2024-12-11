/*
  Warnings:

  - Added the required column `answer` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestResult` ADD COLUMN `answer` VARCHAR(191) NOT NULL;
