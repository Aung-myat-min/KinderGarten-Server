import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import lessonRoute from "./routes/lesson";
import testRoute from "./routes/test";
import parentRoute from "./routes/parent";
import childRoute from "./routes/child";
import { loginParent } from "./models/parent";

const app = express();
const PORT = process.env.PORT || 3000;

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});
// Multer-S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME || "kingergarten",
    acl: "public-read", // Make the file publicly readable
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName); // Use a unique name for the file
    },
  }),
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/lesson", lessonRoute);
app.use("/test", testRoute);
app.use("/parent", parentRoute);
app.use("/child", childRoute);

// File upload route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  // Construct the S3 file URL
  const fileUrl = (req.file as any).location;
  res.json({
    message: "File uploaded successfully",
    file: req.file,
    fileUrl, // Return the S3 file URL
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const valid = await loginParent(email, password);

  if (valid.status === "success" && valid.data) {
    const { parent, childrenIds } = valid.data;

    // Set cookies
    res.cookie("parentId", parent.parentId, { httpOnly: true });
    res.cookie("children", JSON.stringify(childrenIds), { httpOnly: true });

    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: valid.message });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
