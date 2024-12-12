import express from "express";
import {
  CreateMLC,
  GetCompletedLessonsByChildId,
} from "../models/lessonComplete";

const mlcRoute = express.Router();
mlcRoute.use(express.urlencoded({ extended: true }));
mlcRoute.use(express.json());

// Route to create a MarkLessonComplete entry
mlcRoute.post("/create", async (req, res) => {
  const mlcData = req.body;

  try {
    const response = await CreateMLC(mlcData);
    res.status(response.status === "success" ? 200 : 400).json(response);
  } catch (error) {
    console.error("Error in creating MLC:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Route to get completed lessons by childId
mlcRoute.get("/child/:childId", async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    res.status(400).json({ status: "error", message: "Child ID is required" });
    return;
  }

  try {
    const response = await GetCompletedLessonsByChildId(parseInt(childId, 10));
    res.status(response.status === "success" ? 200 : 404).json(response);
  } catch (error) {
    console.error("Error in fetching completed lessons:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default mlcRoute;
