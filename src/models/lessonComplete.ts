import { MarkLessonComplete, PrismaClient } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

export async function CreateMLC(
  mlc: Omit<MarkLessonComplete, "completeId">
): Promise<CustomResponse<MarkLessonComplete>> {
  const response: CustomResponse<MarkLessonComplete> = {
    status: "error",
    message: "The code hasn't run",
  };

  try {
    // Check if the lesson has already been marked as complete for the given child and lessonId
    const existingRecord = await prisma.markLessonComplete.findFirst({
      where: {
        childId: mlc.childId,
        lessonId: mlc.lessonId,
      },
    });

    if (existingRecord) {
      response.status = "error";
      response.message = "Lesson has already been marked as complete.";
      return response;
    }

    // Create the MarkLessonComplete entry
    const createdMLC = await prisma.markLessonComplete.create({
      data: mlc,
    });

    response.status = "success";
    response.message = "Lesson marked as complete successfully.";
    response.data = createdMLC;
  } catch (error) {
    console.error("Error creating MarkLessonComplete entry:", error);
    response.message =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  return response;
}

export async function GetCompletedLessonsByChildId(
  childId: number
): Promise<CustomResponse<MarkLessonComplete[]>> {
  const response: CustomResponse<MarkLessonComplete[]> = {
    status: "error",
    message: "The code hasn't run",
  };

  try {
    // Retrieve completed lessons by childId
    const completedLessons = await prisma.markLessonComplete.findMany({
      where: {
        childId,
      },
      include: {
        lesson: true, // Include related lesson details
      },
    });

    if (completedLessons.length === 0) {
      response.status = "error";
      response.message = "No completed lessons found for this child.";
      return response;
    }

    response.status = "success";
    response.message = "Completed lessons retrieved successfully.";
    response.data = completedLessons;
  } catch (error) {
    console.error("Error retrieving completed lessons:", error);
    response.message =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  return response;
}
