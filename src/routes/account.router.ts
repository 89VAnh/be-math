import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { generateToken } from "../config/jwt";
import { Account } from "../models/Account";
import { AccountService } from "../services/account.service";
import { convertNumber } from "../utils";

const accountRouter = Router();

const accountService = container.resolve(AccountService);

accountRouter.post("/login/admin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const account = await accountService.authenticate(username, password, "1");

    if (account) {
      // Tạo mã thông báo JWT
      const token = generateToken(account);
      account.token = token;
      res.json(account);
    } else {
      res.status(401).json({ message: "Sai mật tài khoản hoặc mật khẩu" });
    }
  } catch (error: any) {
    res.json({ message: error.message });
  }
});

accountRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const account = await accountService.authenticate(username, password, "2");

    if (account) {
      // Tạo mã thông báo JWT
      const token = generateToken(account);
      account.token = token;
      res.json(account);
    } else {
      res.status(401).json({ message: "Sai mật tài khoản hoặc mật khẩu" });
    }
  } catch (error: any) {
    res.json({ message: error.message });
  }
});

accountRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    await accountService.authorize(token);

    res.status(200);
  } catch {
    res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
  }
});

accountRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const results = await accountService.searchAccount({
      page: convertNumber(params.page, 1),
      pageSize: convertNumber(params.page_size, 100),
      ...params,
    });
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

accountRouter.delete("/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    accountService.deleteAccount(username);
    res.json({ message: "Xóa tài khoản thành công" });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

accountRouter.post("/", async (req: Request, res: Response) => {
  try {
    const account = req.body as Account;
    const newAccount = await accountService.createAccount(account);

    res.status(201).json(newAccount);
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Tên tài khoản đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

accountRouter.patch("/change-password", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const newAccount = await accountService.changePw(payload);
    if (newAccount) res.status(201).json(newAccount);
    else if (newAccount === null)
      res.status(401).json({ message: "Sai mật tài khoản hoặc mật khẩu" });
    else res.status(401).json({ message: "Mật khẩu ko chính xác" });
  } catch (error: any) {
    const { message } = error;

    if (message.endsWith(".PRIMARY'"))
      res.status(409).json({ message: "Tên tài khoản đã tồn tại" });
    else res.status(401).json({ message: "Thông tin không hợp lệ" });
  }
});

export default accountRouter;
