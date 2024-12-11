import { PrismaClient, TestResult } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

export async function SaveTestResult(
  testResult: TestResult
): Promise<CustomResponse<null>> {
  try {
    // Save the test result
    await prisma.testResult.create({
      data: testResult,
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
            question: true,
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
