import {
  PrismaClient,
  Test,
  TestType,
  Subject,
  Question,
  QuestionType,
} from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

// Function to get all tests
export async function GetTest(): Promise<CustomResponse<Test[]>> {
  try {
    const tests = await prisma.test.findMany({
      include: {
        questions: true, // Include questions for each test
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
  answer?: string,
  questions?: Question[]
): Promise<CustomResponse<Test>> {
  try {
    const newTest = await prisma.test.create({
      data: {
        subject,
        testType,
        answer,
        questions: {
          create: questions,
        },
      },
    });

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
        subject,
        testType,
        answer,
        questions: {
          update: questions?.map((question) => ({
            where: {
              questionId: question.questionId, // Unique identifier for the question
            },
            data: {
              text: question.text, // Update text or other fields
              questionType: question.questionType, // Update questionType or other fields
            },
          })),
        },
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
