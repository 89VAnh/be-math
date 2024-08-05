import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { Test } from "../models/Test";
import { TestService } from "../services/test.service";
import { convertNumber } from "../utils";

const testRouter = Router();

const testService = container.resolve(TestService);

testRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const test = await testService.getTest(id);
    res.json(test);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

testRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await testService.searchTest({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    });
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

testRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    testService.deleteTest(id);
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

testRouter.post("/", async (req: Request, res: Response) => {
  try {
    const test = req.body as Test;
    const newTest = await testService.createTest(test);

    res.status(201).json(newTest);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Bài thi đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

testRouter.put("/", async (req: Request, res: Response) => {
  try {
    const test = req.body as Test;
    const newTest = await testService.updateTest(test);

    res.status(201).json(newTest);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Bài thi đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

testRouter.post("/submit", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const results = await testService.submitTest(payload);
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

export default testRouter;
