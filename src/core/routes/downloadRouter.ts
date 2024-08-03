import express from "express";
import { container } from "tsyringe";
import { DownloadService } from "../services/downloadService";

const downloadRouter = express.Router();
const downloadService = container.resolve(DownloadService);

downloadRouter.post("/", downloadService.downloadFile);

export default downloadRouter;
