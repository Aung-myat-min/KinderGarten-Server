// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import lessonRoute from "./routes/lesson";
import testRoute from "./routes/test";
import path from "path";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: path.join(__dirname, "../public/") });

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public")));
console.log(path.join(__dirname, "../public"));
app.use("/lesson", lessonRoute);
app.use("/test", testRoute);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  // Construct the relative file path
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: "File uploaded successfully",
    file: req.file,
    fileUrl, // Return the relative path
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
