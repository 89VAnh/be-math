import { v2 as cloudinary } from "cloudinary";
import express, { Request, Response } from "express";
import fs from "fs";
import { container } from "tsyringe";
import { config } from "../../config";
import { UploadService } from "../services/uploadService";
cloudinary.config({
  cloud_name: "dnz7cfnfx",
  api_key: "425175754237622",
  api_secret: "JfiU97XMovSJbqHoYLscnUiAtW0",
});

const uploadRouter = express.Router();
const uploadService = container.resolve(UploadService);

uploadRouter.post(
  "/",
  uploadService.multerUpload,
  async (req: Request, res: Response) => {
    if (!req.file) {
      res
        .status(400)
        .json({ message: "Không thể upload được file", result: false });
      return;
    }
    const filePath = req.file?.path;

    if (filePath)
      if (fs.existsSync(filePath) && req.body.type === "vat") {
        if (fs.statSync(filePath).size >= Number(config.limit_size)) {
          fs.unlinkSync(filePath);
          return res
            .status(400)
            .json({ message: "Không thể upload file quá 5MB", result: false });
        }
      }
    const result = await cloudinary.uploader.upload(filePath);

    return res.json({ path: result.secure_url, result: true });
  }
);

export default uploadRouter;
