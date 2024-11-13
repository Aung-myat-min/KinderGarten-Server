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
        question: true, // Include questions for each test
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
  questions?: { questionId: number; text: string; questionType: QuestionType }[]
): Promise<CustomResponse<Test>> {
  try {
    const updatedTest = await prisma.test.update({
      where: {
        testId,
      },
      data: {
        // subject,
        // testType,
        // answer,
        // question: {
        //   update: questions?.map((question) => ({
        //     where: {
        //       questionId: question.questionId, // Unique identifier for the question
        //     },
        //     data: {
        //       text: question.text, // Update text or other fields
        //       questionType: question.questionType, // Update questionType or other fields
        //     },
        //   })),
        // },
      },
    });

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
