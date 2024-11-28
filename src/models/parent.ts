import bcrypt from "bcrypt";
import { Parent, PrismaClient } from "@prisma/client";
import { CustomResponse } from "../type";

const prisma = new PrismaClient();

export async function CreateNewParent(
  parent: Omit<Parent, "parentId">
): Promise<CustomResponse<Parent>> {
  const response: CustomResponse<Parent> = { status: "error", message: "" };

  try {
    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(parent.password, 10);

    // Save the parent data with the encrypted password
    const newParent = await prisma.parent.create({
      data: { ...parent, password: hashedPassword },
    });

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
      parent.password = "";
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

export async function loginParent(
  email: string,
  password: string
): Promise<CustomResponse<Parent>> {
  const response: CustomResponse<Parent> = { status: "error", message: "" };

  try {
    // Fetch the parent by email
    const parent = await prisma.parent.findUnique({
      where: { email: email },
    });

    if (!parent) {
      response.message = "Invalid email or password.";
      return response;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, parent.password);

    if (!isPasswordValid) {
      response.message = "Invalid email or password.";
      return response;
    }

    response.data = parent;
    response.status = "success";
    response.message = "Login successful!";
  } catch (error) {
    response.error = error instanceof Error ? error.message : "Error!";
  }

  return response;
}
