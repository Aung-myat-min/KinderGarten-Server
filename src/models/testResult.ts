import { PrismaClient, TestType, Subject } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

export async function SaveTestResult(
  childId: number,
  testId: number,
  totalQuestions: number,
  correctAnswers: number
): Promise<CustomResponse<null>> {
  try {
    // Calculate wrong answers
    const wrongAnswers = totalQuestions - correctAnswers;

    // Save the test result
    await prisma.testResult.create({
      data: {
        childId,
        testId,
        testType: TestType.MultipleChoice, // Adjust based on the test type
        subject: Subject.English, // Adjust based on the test subject
        total: totalQuestions,
        correct: correctAnswers,
        wrong: wrongAnswers,
        createdAt: new Date(),
      },
    });

    return {
      status: "success",
      message: "Test result saved successfully",
      data: null,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to save test result",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}

export async function GetTestResults(
  childId: number
): Promise<CustomResponse<any>> {
  try {
    const results = await prisma.testResult.findMany({
      where: { childId },
      include: {
        test: {
          include: {
            question: true, // Include test questions if needed
          },
        },
      },
    });

    return {
      status: "success",
      message: "Test results retrieved successfully",
      data: results,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to retrieve test results",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}
