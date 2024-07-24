import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { generateToken } from "../config/jwt";
import { AccountService } from "../services/account.service";

const accountRouter = Router();

const accountService = container.resolve(AccountService);

/* 
  @openapi 
  /login:
    post:
      tag:
        - Login
        description: Login with username and password
        response:
          200
*/

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

accountRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const { page, page_size } = req.query;

    const accounts = accountService.searchAccount(
      Number(page),
      Number(page_size)
    );
    res.json(accounts);
  } catch (error: any) {
    res.json({ message: error.message });
  }
});

export default accountRouter;
