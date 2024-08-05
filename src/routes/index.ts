import { Router } from "express";
import coreRouter from "../core/routes";
import accountRouter from "./account.router";
import chatRouter from "./chat.router";
import dashboardRouter from "./dashboard.router";
import levelRouter from "./level.router";
import questionRouter from "./question.router";
import resultRouter from "./result.router";
import testRouter from "./test.router";

const router = Router();

router.use("/account", accountRouter);
router.use("/level", levelRouter);
router.use("/question", questionRouter);
router.use("/test", testRouter);
router.use("/core", coreRouter);
router.use("/result", resultRouter);
router.use("/dashboard", dashboardRouter);
router.use("/chat", chatRouter);
export default router;
