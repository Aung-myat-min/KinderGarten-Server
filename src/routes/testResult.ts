import express from "express";
import { SaveTestResult, GetTestResults } from "../models/testResult";
const testResultRoute = express.Router();
testResultRoute.use(express.json());

// Save a new test result
testResultRoute.post("/", async (req, res) => {
  const { testResult } = req.body;

  if (!testResult) {
    res.status(400).json({
      status: "error",
      message: "Test Result is required!",
    });
    return;
  }

  try {
    const response = await SaveTestResult(testResult);
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
