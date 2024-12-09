import express from "express";
import { SaveTestResult, GetTestResults } from "../models/testResult";
const testResultRoute = express.Router();
testResultRoute.use(express.json());

// Save a new test result
testResultRoute.post("/", async (req, res) => {
  const { childId, testId, totalQuestions, correctAnswers } = req.body;

  if (!childId || !testId || !totalQuestions || !correctAnswers) {
    res.status(400).json({
      status: "error",
      message:
        "Child ID, Test ID, total questions, and correct answers are required.",
    });
    return;
  }

  try {
    const response = await SaveTestResult(
      childId,
      testId,
      totalQuestions,
      correctAnswers
    );
    if (response.status === "success") {
      res.status(201).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
      error,
    });
  }
});

// Get all test results for a specific child
testResultRoute.get("/:childId", async (req, res) => {
  const { childId } = req.params;

  try {
    const response = await GetTestResults(parseInt(childId));
    if (response.status === "success") {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
      error,
    });
  }
});

export default testResultRoute;
