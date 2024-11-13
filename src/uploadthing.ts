import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete(async (data) => {
    try {
      console.log("Upload completed:", data);
      console.log("Upload URL:", data.file.url);

      return {
        status: "success",
        fileUrl: data.file.url,
      };
    } catch (error) {
      console.error("Error during upload completion:", error);
      return {
        status: "error",
        message: "An error occurred during upload completion.",
      };
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
