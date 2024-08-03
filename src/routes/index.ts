import { Router } from "express";
import coreRouter from "../core/routes";
import accountRouter from "./account.router";
import levelRouter from "./level.router";
import questionRouter from "./question.router";
import testRouter from "./test.router";

const router = Router();

router.use("/account", accountRouter);
router.use("/level", levelRouter);
router.use("/question", questionRouter);
router.use("/test", testRouter);
router.use("/core", coreRouter);

export default router;
