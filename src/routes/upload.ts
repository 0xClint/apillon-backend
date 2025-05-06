import express from "express";
import { Storage, FileMetadata } from "@apillon/sdk";
import { prepareEnv, EnvLevel } from "../helpers";

const router = express.Router();

prepareEnv(EnvLevel.STORAGE);

const storage = new Storage({
  key: process.env.APILLON_API_KEY!,
  secret: process.env.APILLON_API_SECRET!,
});

router.post("/upload", async (req, res) => {
  try {
    const { fileName, data } = req.body;

    if (!fileName || !data) {
      return res.status(400).json({ error: "fileName and data are required" });
    }

    const jsonString = JSON.stringify(data, null, 2); // Pretty-printed JSON

    const files: FileMetadata[] = [
      {
        content: Buffer.from(jsonString),
        fileName,
        contentType: "application/json",
      },
    ];

    const uploadResult = await storage
      .bucket(process.env.APILLON_BUCKET!)
      .uploadFiles(files);
    console.log(uploadResult);
    res.json({ message: "Upload successful", result: uploadResult });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default router;
