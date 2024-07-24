import { Router } from "express";
import accountRouter from "./account.router";

const router = Router();

router.use("/account", accountRouter);

export default router;
