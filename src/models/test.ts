import {
  PrismaClient,
  Test,
  TestType,
  Subject,
  Question,
  QuestionType,
  Option,
  MultipleChoice,
  FillInTheBlank,
  PhotoQuestion,
} from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

// Function to get all tests
export async function GetTest(): Promise<CustomResponse<Test[]>> {
  try {
    const tests = await prisma.test.findMany({
      include: {
        question: {
          include: {
            // Include all possible sub-question types; only one will be populated per question
            multipleChoice: {
              include: {
                options: true, // Include options if the question is of type MultipleChoice
              },
            },
            fillInTheBlank: true, // Include if question is of type FillInTheBlank
            photoQuestion: true, // Include if question is of type PhotoQuestion
          },
        },
      },
    });

    return {
      status: "success",
      message: "Tests retrieved successfully",
      data: tests,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to retrieve tests",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}

// Function to create a new test
export async function CreateTest(
  subject: Subject,
  testType: TestType,
  answer: string,
  question: Question,
  multipleChoice?: MultipleChoice,
  fillInTheBlank?: FillInTheBlank,
  photoQuestion?: PhotoQuestion,
  options?: Option[]
): Promise<CustomResponse<Test>> {
  try {
    // Create the test
    const newTest = await prisma.test.create({
      data: {
        subject: subject,
        testType: testType,
        answer: answer,
      },
    });

    // Check if question text and type are provided
    if (question?.text && question.questionType) {
      // Create the main question
      const createdQuestion = await prisma.question.create({
        data: {
          text: question.text,
          questionType: question.questionType,
          testId: newTest.testId,
        },
      });

      // Handle MultipleChoice question type
      if (question.questionType === "MultipleChoice" && multipleChoice) {
        // Create MultipleChoice record
        const createdMultipleChoice = await prisma.multipleChoice.create({
          data: {
            questionId: createdQuestion.questionId,
            multipleChoicePhoto: multipleChoice.multipleChoicePhoto,
          },
        });

        // Create options for MultipleChoice, if provided
        if (options) {
          await prisma.option.createMany({
            data: options.map((option: Option) => ({
              text: option.text,
              isCorrect: option.isCorrect,
              multipleChoiceId: createdMultipleChoice.questionId,
            })),
          });
        }
      }

      // Handle FillInTheBlank question type
      if (question.questionType === "FillInTheBlank" && fillInTheBlank) {
        await prisma.fillInTheBlank.create({
          data: {
            questionId: createdQuestion.questionId,
            correctAnswer: fillInTheBlank.correctAnswer,
          },
        });
      }

      // Handle PhotoQuestion question type
      if (question.questionType === "PhotoQuestion" && photoQuestion) {
        await prisma.photoQuestion.create({
          data: {
            questionId: createdQuestion.questionId,
            photoUrl: photoQuestion.photoUrl,
          },
        });
      }
    }

    return {
      status: "success",
      message: "Test created successfully",
      data: newTest,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create test",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}

// Function to edit an existing test
export async function EditTest(
  testId: number,
  subject?: Subject,
  testType?: TestType,
  answer?: string,
  questions?: {
    questionId: number;
    text: string;
    questionType: QuestionType;
    multipleChoice?: {
      multipleChoicePhoto?: string;
      options?: { optionId: number; text: string; isCorrect: boolean }[];
    };
    fillInTheBlank?: { correctAnswer: string };
    photoQuestion?: { photoUrl: string };
  }[]
): Promise<CustomResponse<Test>> {
  try {
    // Update the main test details
    const updatedTest = await prisma.test.update({
      where: { testId },
      data: {
        subject,
        testType,
        answer,
      },
    });

    // Update each question associated with the test
    for (const question of questions || []) {
      const updatedQuestion = await prisma.question.update({
        where: { questionId: question.questionId },
        data: {
          text: question.text,
          questionType: question.questionType,
        },
      });

      // Update the related sub-question types based on questionType
      if (
        question.questionType === "MultipleChoice" &&
        question.multipleChoice
      ) {
        const { multipleChoicePhoto, options } = question.multipleChoice;

        // Update MultipleChoice fields
        await prisma.multipleChoice.update({
          where: { questionId: question.questionId },
          data: { multipleChoicePhoto },
        });

        // Update options within MultipleChoice
        if (options) {
          for (const option of options) {
            await prisma.option.update({
              where: { optionId: option.optionId },
              data: {
                text: option.text,
                isCorrect: option.isCorrect,
              },
            });
          }
        }
      } else if (
        question.questionType === "FillInTheBlank" &&
        question.fillInTheBlank
      ) {
        await prisma.fillInTheBlank.update({
          where: { questionId: question.questionId },
          data: { correctAnswer: question.fillInTheBlank.correctAnswer },
        });
      } else if (
        question.questionType === "PhotoQuestion" &&
        question.photoQuestion
      ) {
        await prisma.photoQuestion.update({
          where: { questionId: question.questionId },
          data: { photoUrl: question.photoQuestion.photoUrl },
        });
      }
    }

    return {
      status: "success",
      message: "Test updated successfully",
      data: updatedTest,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update test",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}

// Function to delete a test
export async function DeleteTest(
  testId: number
): Promise<CustomResponse<null>> {
  try {
    await prisma.test.delete({
      where: {
        testId,
      },
    });

    return {
      status: "success",
      message: "Test deleted successfully",
      data: null,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete test",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}
