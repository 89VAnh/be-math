import { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.error("Lỗi:", err);
  res.status(500).json({ error: "Lỗi máy chủ" });
};
