import { injectable } from "tsyringe";
import { DashboardRepository } from "../repositories/dashboard.repository";

@injectable()
export class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getDashboard(): Promise<any> {
    const dashboard = await this.dashboardRepository.getDashboard();
    if (dashboard) {
      return dashboard;
    }
    return null;
  }
}
