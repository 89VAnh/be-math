import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { DashboardService } from "../services/dashboard.service";

const dashboardRouter = Router();

const dashboardService = container.resolve(DashboardService);

dashboardRouter.get("/", async (_: Request, res: Response) => {
  try {
    const results = await dashboardService.getDashboard();
    res.json(results);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

export default dashboardRouter;
