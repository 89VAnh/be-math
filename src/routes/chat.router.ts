import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { Chat } from "../models/Chat";
import { ChatService } from "../services/chat.service";
import { convertNumber } from "../utils";

const chatRouter = Router();

const chatService = container.resolve(ChatService);

chatRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await chatService.searchChat({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    });
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

chatRouter.post("/", async (req: Request, res: Response) => {
  try {
    const chat = req.body as Chat;
    const newChat = await chatService.createChat(chat);

    res.status(201).json(newChat);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Cấp bậc đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

chatRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    chatService.deleteChat(convertNumber(id, 0));
    res.json({ message: "Xóa tin nhắn thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

export default chatRouter;
