import express from "express";
import {
  CreateNewParent,
  GetParentById,
  DeleteParentById,
  UpdateParent,
} from "../models/parent";
import { Parent } from "@prisma/client";

const parentRoute = express.Router();

parentRoute.use(express.urlencoded({ extended: true }));
parentRoute.use(express.json());

// Create a new parent
parentRoute.post("/", async (req, res) => {
  const parentData: Omit<Parent, "parentId"> = req.body;

  try {
    const result = await CreateNewParent(parentData);
    res.status(result.status === "success" ? 201 : 400).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Get a parent by ID
parentRoute.get("/:id", async (req, res) => {
  const parentId = parseInt(req.params.id);

  if (isNaN(parentId)) {
    res.status(400).json({ status: "error", message: "Invalid ID." });
    return;
  }

  try {
    const result = await GetParentById(parentId);
    res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Update a parent
parentRoute.put("/:id", async (req, res) => {
  const parentId = parseInt(req.params.id);

  if (isNaN(parentId)) {
    res.status(400).json({ status: "error", message: "Invalid ID." });
    return;
  }

  const updateData: Partial<Omit<Parent, "parentId">> = req.body;

  try {
    const result = await UpdateParent(parentId, updateData);
    res.status(result.status === "success" ? 200 : 400).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

// Delete a parent
parentRoute.delete("/:id", async (req, res) => {
  const parentId = parseInt(req.params.id);

  if (isNaN(parentId)) {
    res.status(400).json({ status: "error", message: "Invalid ID." });
    return;
  }

  try {
    const result = await DeleteParentById(parentId);
    res.status(result.status === "success" ? 200 : 404).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
});

export default parentRoute;
