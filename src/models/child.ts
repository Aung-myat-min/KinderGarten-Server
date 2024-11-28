import { PrismaClient, Child } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

/**
 * Create a new child under a parent
 * @param parentId - The ID of the parent
 * @param child - The child data (excluding childId and parentId)
 * @returns A promise with the created child information
 */
export async function createChild(
  parentId: number,
  child: Omit<Child, "childId" | "parentId">
): Promise<CustomResponse<Child>> {
  const response: CustomResponse<Child> = { status: "error", message: "" };

  try {
    const newChild = await prisma.child.create({
      data: {
        ...child,
        parentId,
      },
    });

    response.status = "success";
    response.message = "Child created successfully!";
    response.data = newChild;
  } catch (error) {
    response.error =
      error instanceof Error ? error.message : "Error creating child!";
  }

  return response;
}

/**
 * Get all children by parent ID
 * @param parentId - The ID of the parent
 * @returns A promise with a list of children for the parent
 */
export async function getChildrenByParent(
  parentId: number
): Promise<CustomResponse<Child[]>> {
  const response: CustomResponse<Child[]> = { status: "error", message: "" };

  try {
    const children = await prisma.child.findMany({
      where: { parentId },
    });

    response.status = "success";
    response.message = "Children fetched successfully!";
    response.data = children;
  } catch (error) {
    response.error =
      error instanceof Error ? error.message : "Error fetching children!";
  }

  return response;
}

/**
 * Update a child's information
 * @param child - The updated child data (must include childId)
 * @returns A promise with the updated child information
 */
export async function updateChildren(
  child: Child
): Promise<CustomResponse<Child>> {
  const response: CustomResponse<Child> = { status: "error", message: "" };

  try {
    const updatedChild = await prisma.child.update({
      where: { childId: child.childId },
      data: child,
    });

    response.status = "success";
    response.message = "Child updated successfully!";
    response.data = updatedChild;
  } catch (error) {
    response.error =
      error instanceof Error ? error.message : "Error updating child!";
  }

  return response;
}

/**
 * Delete a child by their ID
 * @param childId - The ID of the child to delete
 * @returns A promise indicating success or failure
 */
export async function deleteChildren(
  childId: number
): Promise<CustomResponse<null>> {
  const response: CustomResponse<null> = { status: "error", message: "" };

  try {
    await prisma.child.delete({
      where: { childId },
    });

    response.status = "success";
    response.message = "Child deleted successfully!";
  } catch (error) {
    response.error =
      error instanceof Error ? error.message : "Error deleting child!";
  }

  return response;
}