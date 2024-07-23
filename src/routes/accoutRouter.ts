import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { generateToken } from "../config/jwt";
import { AccountService } from "../services/accountService";

const accountRouter = Router();

const accountService = container.resolve(AccountService);

accountRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const account = await accountService.authenticate(username, password);

    if (account) {
      // Tạo mã thông báo JWT
      const token = generateToken(account);
      account.token = token;
      res.json({ message: "Đăng nhập thành công", account });
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

export default accountRouter;
