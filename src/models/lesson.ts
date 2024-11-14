import {
  PrismaClient,
  LessonType,
  Subject,
  Lesson,
  Module,
} from "@prisma/client";
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
  lessonTitle: string,
  lessonType: LessonType,
  subject: Subject,
  modules?: { word: string; photoUrl?: string }[]
): Promise<CustomResponse<Lesson>> {
  try {
    const newLesson = await prisma.lesson.create({
      data: {
        lessonTitle,
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
  lessonTitle: string,
  lessonType?: LessonType,
  subject?: Subject,
  existingModules?: Module[],
  newModules?: { word: string; photoUrl?: string }[]
): Promise<CustomResponse<Lesson>> {
  try {
    // First, update existing modules if provided
    if (existingModules) {
      await Promise.all(
        existingModules.map(async (module) =>
          prisma.module.update({
            where: { moduleId: module.moduleId },
            data: { word: module.word, photoUrl: module.photoUrl },
          })
        )
      );
    }

    // Then, handle new modules (if any) by creating them
    const updatedLesson = await prisma.lesson.update({
      where: { lessonId },
      data: {
        lessonTitle,
        lessonType,
        subject,
        modules: newModules
          ? {
              create: newModules, // Add new modules only
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
