import { Router } from "express";
import accountRouter from "./accoutRouter";

const router = Router();

router.use("/account", accountRouter);

export default router;
