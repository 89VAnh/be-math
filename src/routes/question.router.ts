import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { Question } from "../models/Question";
import { QuestionService } from "../services/question.service";
import { convertNumber } from "../utils";

const questionRouter = Router();

const questionService = container.resolve(QuestionService);

questionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await questionService.searchQuestion({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    });
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

questionRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestion(convertNumber(id, 0));
    res.json(question);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

questionRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    questionService.deleteQuestion(convertNumber(id, 0));
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

questionRouter.post("/", async (req: Request, res: Response) => {
  try {
    const question = req.body as Question;
    const newQuestion = await questionService.createQuestion(question);

    res.status(201).json(newQuestion);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Câu hỏi đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

questionRouter.put("/", async (req: Request, res: Response) => {
  try {
    const question = req.body as Question;
    const newQuestion = await questionService.updateQuestion(question);

    res.status(201).json(newQuestion);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Câu hỏi đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

export default questionRouter;
