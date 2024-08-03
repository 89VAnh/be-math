import express from "express";
import { container } from "tsyringe";
import { DeleteFileService } from "../services/deleteFileService";

const deleteFileRouter = express.Router();
const deleteFileService = container.resolve(DeleteFileService);

deleteFileRouter.post("/", deleteFileService.deleteFile);

export default deleteFileRouter;
