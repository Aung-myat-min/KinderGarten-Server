import express from "express";
import { getTestResultsBySubject } from "../models/analysis";

const analysisRouter = express.Router();

analysisRouter.get("/results/subject/:childId", async (req, res) => {
  const childId = parseInt(req.params.childId, 10);

  if (isNaN(childId)) {
    res.status(400).json({
      status: "error",
      message: "Invalid childId",
    });
    return;
  }

  const results = await getTestResultsBySubject(childId);
  res.status(200).json(results);
});

export default analysisRouter;
