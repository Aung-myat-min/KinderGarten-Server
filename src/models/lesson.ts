import { PrismaClient, LessonType, Subject, Lesson } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

// Fetch all lessons
export async function GetLesson(): Promise<CustomResponse<Lesson[]>> {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        modules: true, // Include related modules
      },
    });
    return {
      status: "success",
      message: "Lessons retrieved successfully",
      data: lessons,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error retrieving lessons",
      error: error instanceof Error ? error.message : "Error!",
    };
  }
}

// Create a new lesson
export async function CreateLesson(
  lessonType: LessonType,
  subject: Subject,
  modules?: { word: string; photoUrl?: string }[]
): Promise<CustomResponse<Lesson>> {
  try {
    const newLesson = await prisma.lesson.create({
      data: {
        lessonType,
        subject,
        modules: {
          create: modules || [],
        },
      },
      include: {
        modules: true,
      },
    });
    return {
      status: "success",
      message: "Lesson created successfully",
      data: newLesson,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error creating lesson",
      error: error instanceof Error ? error.message : "Error!",
    };
  }
}

// Update an existing lesson
export async function EditLesson(
  lessonId: number,
  lessonType?: LessonType,
  subject?: Subject,
  modules?: { word: string; photoUrl?: string }[]
): Promise<CustomResponse<Lesson>> {
  try {
    const updatedLesson = await prisma.lesson.update({
      where: { lessonId },
      data: {
        lessonType,
        subject,
        modules: modules
          ? {
              deleteMany: {}, // Clear current modules
              create: modules, // Add new modules
            }
          : undefined,
      },
      include: {
        modules: true,
      },
    });
    return {
      status: "success",
      message: "Lesson updated successfully",
      data: updatedLesson,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error updating lesson",
      error: error instanceof Error ? error.message : "Error!",
    };
  }
}

// Delete a lesson by ID
export async function DeleteLesson(
  lessonId: number
): Promise<CustomResponse<null>> {
  try {
    await prisma.lesson.delete({
      where: { lessonId },
    });
    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error deleting lesson",
      error: error instanceof Error ? error.message : "Error!",
    };
  }
}
