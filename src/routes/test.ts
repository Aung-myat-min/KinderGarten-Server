import express from "express";
import { GetTest, CreateTest, EditTest, DeleteTest } from "../models/test";
import { Subject, TestType, QuestionType } from "@prisma/client";

const testRoute = express.Router();
testRoute.use(express.urlencoded({ extended: true }));
testRoute.use(express.json());

// Route to get all tests
testRoute.get("/", async (req, res) => {
  const result = await GetTest();
  if (result.status === "success") {
    res.status(200).json(result);
    return;
  } else {
    res.status(500).json(result);
    return;
  }
});

// Route to create a new test
testRoute.post("/", async (req, res) => {
  const {
    subject,
    testType,
    answer,
    question,
    multipleChoice,
    fillInTheBlank,
    photoQuestion,
    options,
  } = req.body;

  try {
    // Validate required fields
    if (!subject || !testType || !question) {
      res.status(400).json({
        status: "error",
        message: "Subject, Test Type, and a question are required.",
      });
      return;
    }

    // Call CreateTest with the provided data
    const result = await CreateTest(
      subject as Subject,
      testType as TestType,
      answer,
      question,
      multipleChoice,
      fillInTheBlank,
      photoQuestion,
      options
    );

    if (result.status === "success") {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create test",
      error: error instanceof Error ? error.message : "Error",
    });
  }
});

// Route to edit an existing test
testRoute.put("/:testId", async (req, res) => {
  const { testId } = req.params;
  const { subject, testType, answer, questions } = req.body;

  try {
    const result = await EditTest(
      parseInt(testId),
      subject as Subject,
      testType as TestType,
      answer,
      questions
    );

    if (result.status === "success") {
      res.status(200).json(result);
      return;
    } else {
      res.status(500).json(result);
      return;
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update test",
      error: error instanceof Error ? error.message : "Error",
    });
    return;
  }
});

// Route to delete a test
testRoute.delete("/:testId", async (req, res) => {
  const { testId } = req.params;

  try {
    const result = await DeleteTest(parseInt(testId));

    if (result.status === "success") {
      res.status(200).json(result);
      return;
    } else {
      res.status(500).json(result);
      return;
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete test",
      error: error instanceof Error ? error.message : "Error",
    });
    return;
  }
});

export default testRoute;
