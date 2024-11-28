import { Parent, PrismaClient } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

export async function CreateNewParent(
  parent: Omit<Parent, "parentId">
): Promise<CustomResponse<Parent>> {
  const response: CustomResponse<Parent> = { status: "error", message: "" };

  try {
    const newParent = await prisma.parent.create({ data: parent });
    response.data = newParent;
    response.status = "success";
    response.message = "Parent Created!";
  } catch (error) {
    response.error = error instanceof Error ? error.message : "Error!";
  }

  return response;
}

export async function GetParentById(
  parentId: number
): Promise<CustomResponse<Parent>> {
  const response: CustomResponse<Parent> = { status: "error", message: "" };

  try {
    const parent = await prisma.parent.findUnique({
      where: { parentId },
      include: { children: true }, // Includes related children if needed
    });

    if (!parent) {
      response.message = "Parent not found.";
    } else {
      response.data = parent;
      response.status = "success";
      response.message = "Parent retrieved successfully!";
    }
  } catch (error) {
    response.error = error instanceof Error ? error.message : "Error!";
  }

  return response;
}

export async function DeleteParentById(
  parentId: number
): Promise<CustomResponse<null>> {
  const response: CustomResponse<null> = { status: "error", message: "" };

  try {
    await prisma.parent.delete({
      where: { parentId },
    });

    response.status = "success";
    response.message = "Parent deleted successfully!";
  } catch (error) {
    response.error = error instanceof Error ? error.message : "Error!";
    response.message = "Failed to delete parent.";
  }

  return response;
}

export async function UpdateParent(
  parentId: number,
  updateData: Partial<Omit<Parent, "parentId">>
): Promise<CustomResponse<Parent>> {
  const response: CustomResponse<Parent> = { status: "error", message: "" };

  try {
    const updatedParent = await prisma.parent.update({
      where: { parentId },
      data: updateData,
    });

    response.data = updatedParent;
    response.status = "success";
    response.message = "Parent updated successfully!";
  } catch (error) {
    response.error = error instanceof Error ? error.message : "Error!";
    response.message = "Failed to update parent.";
  }

  return response;
}
