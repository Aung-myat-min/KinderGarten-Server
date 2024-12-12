import express from "express";
import {
  CreateMLC,
  GetLessonsBySubjectAndChild,
} from "../models/lessonComplete";
import { Subject } from "@prisma/client";

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
// Route to get total and completed lessons by subject and childId
mlcRoute.get("/child/:childId/subject/:subject", async (req, res) => {
  const { childId, subject } = req.params;

  if (!childId || !subject) {
    res
      .status(400)
      .json({ status: "error", message: "Child ID and subject are required" });
    return;
  }

  if (!Object.values(Subject).includes(subject as Subject)) {
    res.status(400).json({ status: "error", message: "Invalid subject" });
    return;
  }

  try {
    const response = await GetLessonsBySubjectAndChild(
      parseInt(childId, 10),
      subject as Subject
    );
    res.status(response.status === "success" ? 200 : 404).json(response);
  } catch (error) {
    console.error("Error in fetching lessons data:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default mlcRoute;
