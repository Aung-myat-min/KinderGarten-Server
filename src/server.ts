// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import lessonRoute from "./routes/lesson";
import testRoute from "./routes/test";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

app.use("/lesson", lessonRoute);
app.use("/test", testRoute);

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express and CORS!");
});

// Example POST route
app.post("/data", (req: Request, res: Response) => {
  const data = req.body;
  res.json({ message: "Data received", data });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
