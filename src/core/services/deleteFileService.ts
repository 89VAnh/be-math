import { Request, Response } from "express";
import fs from "fs";

export class DeleteFileService {
  private delete = function (req: Request, res: Response) {
    try {
      const filePath = req.body.filePath;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      else return res.status(200).json({ message: "File không tồn tại" });
      res.status(200).json({ message: "Xóa file thành công" });
    } catch (err) {
      res.status(500).json({ message: "Không thể xóa" });
    }
  };

  get deleteFile() {
    return this.delete;
  }
}
