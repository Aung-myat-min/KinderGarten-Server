import { PrismaClient, LessonType, Lesson, Module } from "@prisma/client";
import { CustomResponse } from "../type";
import { Subject } from "@prisma/client";

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

//Fetch Lesson By Subject
export async function GetLessonsBySub(
  sub: Subject
): Promise<CustomResponse<Lesson[]>> {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        modules: true, // Include related modules
      },
      where: {
        subject: sub,
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
    // Find existing modules in the database
    const currentModules = await prisma.module.findMany({
      where: { lessonId },
    });

    // Delete modules not in the `existingModules` list
    const currentModuleIds = currentModules.map((m) => m.moduleId);
    const existingModuleIds = existingModules?.map((m) => m.moduleId) || [];
    const modulesToDelete = currentModuleIds.filter(
      (id) => !existingModuleIds.includes(id)
    );

    if (modulesToDelete.length > 0) {
      await prisma.module.deleteMany({
        where: { moduleId: { in: modulesToDelete } },
      });
    }

    // Update existing modules
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

    // Add new modules
    const lessonUpdateData: any = {
      lessonTitle,
      lessonType,
      subject,
    };
    if (newModules && newModules.length > 0) {
      lessonUpdateData.modules = { create: newModules };
    }

    const updatedLesson = await prisma.lesson.update({
      where: { lessonId },
      data: lessonUpdateData,
      include: { modules: true },
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
    // Delete related modules first
    await prisma.module.deleteMany({
      where: { lessonId },
    });

    // Delete the lesson
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
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
