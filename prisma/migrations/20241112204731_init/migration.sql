-- CreateTable
CREATE TABLE `Lesson` (
    `lessonId` INTEGER NOT NULL AUTO_INCREMENT,
    `lessonType` ENUM('letter', 'number', 'bodypart', 'color', 'animal', 'shape') NOT NULL,
    `subject` ENUM('English', 'Myanmar') NOT NULL,

    PRIMARY KEY (`lessonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `moduleId` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `lessonId` INTEGER NOT NULL,

    PRIMARY KEY (`moduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test` (
    `testId` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` ENUM('English', 'Myanmar') NOT NULL,
    `testType` ENUM('MultipleChoice', 'FillInTheBlank', 'PhotoQuestion') NOT NULL,
    `answer` VARCHAR(191) NULL,

    PRIMARY KEY (`testId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `questionId` INTEGER NOT NULL AUTO_INCREMENT,
    `testId` INTEGER NOT NULL,
    `questionType` ENUM('MultipleChoice', 'FillInTheBlank', 'PhotoQuestion') NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MultipleChoice` (
    `questionId` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FillInTheBlank` (
    `questionId` INTEGER NOT NULL AUTO_INCREMENT,
    `correctAnswer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoQuestion` (
    `questionId` INTEGER NOT NULL AUTO_INCREMENT,
    `photoUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `optionId` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `multipleChoiceId` INTEGER NOT NULL,

    PRIMARY KEY (`optionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`lessonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`testId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MultipleChoice` ADD CONSTRAINT `MultipleChoice_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FillInTheBlank` ADD CONSTRAINT `FillInTheBlank_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoQuestion` ADD CONSTRAINT `PhotoQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_multipleChoiceId_fkey` FOREIGN KEY (`multipleChoiceId`) REFERENCES `MultipleChoice`(`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;
