// src/routes/lessonRoute.ts
import express from "express";
import {
  CreateLesson,
  GetLesson,
  EditLesson,
  DeleteLesson,
} from "../models/lesson";
import { LessonType, Subject } from "@prisma/client";

const lessonRoute = express.Router();
lessonRoute.use(express.json());

// Get all lessons
lessonRoute.get("/", async (req, res) => {
  const response = await GetLesson();
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

// Create a new lesson
lessonRoute.post("/", async (req, res) => {
  const { lessonTitle, lessonType, subject, modules } = req.body;

  if (!lessonType || !subject) {
    res.status(400).json({
      status: "error",
      message: "Lesson type and subject are required.",
    });
    return;
  }

  const response = await CreateLesson(
    lessonTitle,
    lessonType as LessonType,
    subject as Subject,
    modules
  );
  if (response.status === "success") {
    res.status(201).json(response);
  } else {
    res.status(500).json(response);
  }
});

// Update an existing lesson
lessonRoute.put("/:lessonId", async (req, res) => {
  const { lessonId } = req.params;
  const { lessonTitle, lessonType, subject, existingModules, newModules } =
    req.body;

  const response = await EditLesson(
    parseInt(lessonId),
    lessonTitle,
    lessonType as LessonType,
    subject as Subject,
    existingModules,
    newModules
  );
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

// Delete a lesson
lessonRoute.delete("/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  const response = await DeleteLesson(parseInt(lessonId));
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

export default lessonRoute;
