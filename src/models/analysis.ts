import { PrismaClient, Subject } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTestResultsBySubject(childId: number) {
  try {
    const results = await prisma.testResult.groupBy({
      by: ["subject"],
      where: {
        childId,
      },
      _sum: {},
      _count: {
        testId: true,
      },
    });

    return {
      status: "success",
      message: "Test results grouped by subject retrieved successfully",
      data: results.map((result) => ({
        // subject: result.subject,
        // totalTests: result._count.testId,
        // totalQuestions: result._sum.total || 0,
        // totalCorrect: result._sum.correct || 0,
        // totalWrong: result._sum.wrong || 0,
      })),
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to retrieve test results grouped by subject",
      error: error instanceof Error ? error.message : "Error",
    };
  }
}
