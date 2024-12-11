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
    // Step 1: Group results by subject, testType, and testId
    const results = await prisma.testResult.groupBy({
      by: ["subject", "testType", "testId"],
      where: { childId },
      _max: { createdAt: true },
    });

    // Step 2: Process each grouped result
    const detailedResults = await Promise.all(
      results.map(async (result) => {
        const { subject, testType, testId, _max } = result;

        // If `_max.createdAt` is null, skip processing this group
        if (!_max.createdAt) {
          return null;
        }

        // Fetch all results for this test with the latest createdAt
        const testResults = await prisma.testResult.findMany({
          where: {
            childId,
            subject,
            testType,
            testId,
            createdAt: _max.createdAt, // Ensure _max.createdAt is not null
          },
        });

        const correctAnswers = testResults.filter((tr) => tr.correct).length;
        const totalTests = testResults.length;
        const wrongAnswers = totalTests - correctAnswers;
        const percentageCorrect =
          totalTests > 0 ? (correctAnswers / totalTests) * 100 : 0;

        return {
          subject,
          testType,
          testId,
          totalTests,
          correctAnswers,
          wrongAnswers,
          percentageCorrect,
        };
      })
    );

    // Remove any null results
    const filteredResults = detailedResults.filter((result) => result !== null);

    return {
      status: "success",
      message: "Test results retrieved successfully",
      data: filteredResults,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to retrieve test results",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}
