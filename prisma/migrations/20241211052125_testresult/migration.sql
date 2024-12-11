/*
  Warnings:

  - You are about to drop the column `total` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `wrong` on the `TestResult` table. All the data in the column will be lost.
  - You are about to alter the column `correct` on the `TestResult` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `TestResult` DROP COLUMN `total`,
    DROP COLUMN `wrong`,
    MODIFY `correct` BOOLEAN NOT NULL;
