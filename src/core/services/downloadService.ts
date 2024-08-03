import { Request, Response } from "express";

export class DownloadService {
  private download = function (req: Request, res: Response) {
    try {
      const filePath = req.body.filePath;

      res.download(filePath, function (err) {
        if (err) {
          res.status(400).json({ message: "Có lỗi xảy ra" });
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Không thể download" });
    }
  };

  get downloadFile() {
    return this.download;
  }
}
