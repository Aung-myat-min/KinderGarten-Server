import { MarkLessonComplete, PrismaClient, Subject } from "@prisma/client";
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
export async function GetLessonsBySubjectAndChild(
  childId: number,
  subject: Subject
): Promise<CustomResponse<{ totalLessons: number; completedLessons: number }>> {
  const response: CustomResponse<{
    totalLessons: number;
    completedLessons: number;
  }> = {
    status: "error",
    message: "The code hasn't run",
  };

  try {
    // Count total lessons for the given subject
    const totalLessons = await prisma.lesson.count({
      where: {
        subject,
      },
    });

    // Count completed lessons for the child and subject
    const completedLessons = await prisma.markLessonComplete.count({
      where: {
        childId,
        subject,
      },
    });

    response.status = "success";
    response.message = "Lessons data retrieved successfully.";
    response.data = { totalLessons, completedLessons };
  } catch (error) {
    console.error("Error retrieving lessons data:", error);
    response.message =
      error instanceof Error ? error.message : "Unknown error occurred.";
  }

  return response;
}
