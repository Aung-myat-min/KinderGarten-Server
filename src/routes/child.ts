import express from "express";
import {
  createChild,
  getChildrenByParent,
  updateChildren,
  deleteChildren,
  getChildNameById,
  getChildrenWithParentDetails,
  getChildById,
} from "../models/child";

const childRoute = express.Router();

childRoute.use(express.urlencoded({ extended: true }));
childRoute.use(express.json());

// Create a new child
childRoute.post("/", async (req, res) => {
  const { parentId, child } = req.body;

  if (!parentId || !child) {
    res.status(400).json({ message: "Parent ID and child data are required" });
    return;
  }

  try {
    const response = await createChild(parentId, child);
    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

childRoute.get("/admin", async (req, res) => {
  try {
    const children = await getChildrenWithParentDetails();

    res.status(200).json(children);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

// Get all children by parent ID
childRoute.get("/:parentId", async (req, res) => {
  const { parentId } = req.params;

  if (!parentId) {
    res.status(400).json({ message: "Parent ID is required" });
    return;
  }

  try {
    const response = await getChildrenByParent(Number(parentId));
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

// Get all children by parent ID
childRoute.get("/get/:childId", async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    res.status(400).json({ message: "Parent ID is required" });
    return;
  }

  try {
    const response = await getChildNameById(Number(childId));
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

// Fetch a child by ID
childRoute.get("/child/:childId", async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    res.status(400).json({ message: "Child ID is required" });
    return;
  }

  try {
    const response = await getChildById(Number(childId));
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

// Update a child
childRoute.put("/", async (req, res) => {
  const child = req.body;

  if (!child || !child.childId) {
    res.status(400).json({ message: "Child data with childId is required" });
    return;
  }

  try {
    const response = await updateChildren(child);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

// Delete a child by ID
childRoute.delete("/:childId", async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    res.status(400).json({ message: "Child ID is required" });
    return;
  }

  try {
    const response = await deleteChildren(Number(childId));
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Error!" });
  }
});

export default childRoute;
