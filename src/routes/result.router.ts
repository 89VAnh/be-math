import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { Result, SearchResults } from "../models/Result";
import { ResultService } from "../services/result.service";
import { convertNumber } from "../utils";

const resultRouter = Router();

const resultService = container.resolve(ResultService);

resultRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const results = await resultService.getResult(Number(id));
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

resultRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await resultService.searchResult({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    } as SearchResults);
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

resultRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    resultService.deleteResult(Number(id));
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

resultRouter.post("/", async (req: Request, res: Response) => {
  try {
    const result = req.body as Result;
    const newResult = await resultService.createResult(result);

    res.status(201).json(newResult);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Tên tài khoản đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

resultRouter.get("/rank", async (_: Request, res: Response) => {
  res.json(resultService.getRankResult());
});

export default resultRouter;
