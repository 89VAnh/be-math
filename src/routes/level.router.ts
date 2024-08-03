import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { Level } from "../models/Level";
import { LevelService } from "../services/level.service";
import { convertNumber } from "../utils";

const levelRouter = Router();

const levelService = container.resolve(LevelService);

levelRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await levelService.searchLevel({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    });
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

levelRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const level = await levelService.getLevel(convertNumber(id, 0));
    res.json(level);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

levelRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    levelService.deleteLevel(convertNumber(id, 0));
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

levelRouter.post("/", async (req: Request, res: Response) => {
  try {
    const level = req.body as Level;
    const newLevel = await levelService.createLevel(level);

    res.status(201).json(newLevel);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Cấp bậc đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

levelRouter.put("/", async (req: Request, res: Response) => {
  try {
    const level = req.body as Level;
    const newLevel = await levelService.updateLevel(level);

    res.status(201).json(newLevel);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Cấp bậc đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

export default levelRouter;
