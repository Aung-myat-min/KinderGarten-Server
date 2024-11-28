-- CreateTable
CREATE TABLE `Parent` (
    `parentId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `NRC` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profileURL` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`parentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Child` (
    `childId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parentId` INTEGER NOT NULL,
    `profileURL` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarkLessonComplete` (
    `completeId` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` ENUM('English', 'Myanmar') NOT NULL,
    `lessonType` ENUM('letter', 'number', 'bodypart', 'color', 'animal', 'shape') NOT NULL,
    `completedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `childId` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,

    PRIMARY KEY (`completeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestResult` (
    `resultId` INTEGER NOT NULL AUTO_INCREMENT,
    `testType` ENUM('MultipleChoice', 'FillInTheBlank', 'PhotoQuestion') NOT NULL,
    `subject` ENUM('English', 'Myanmar') NOT NULL,
    `total` INTEGER NOT NULL,
    `correct` INTEGER NOT NULL,
    `wrong` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `childId` INTEGER NOT NULL,
    `testId` INTEGER NOT NULL,

    PRIMARY KEY (`resultId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parent`(`parentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarkLessonComplete` ADD CONSTRAINT `MarkLessonComplete_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Child`(`childId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarkLessonComplete` ADD CONSTRAINT `MarkLessonComplete_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`lessonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestResult` ADD CONSTRAINT `TestResult_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Child`(`childId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestResult` ADD CONSTRAINT `TestResult_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`testId`) ON DELETE RESTRICT ON UPDATE CASCADE;
