import { injectable } from "tsyringe";
import { Database } from "../config/database";

@injectable()
export class DashboardRepository {
  constructor(private db: Database) {}
  async getDashboard(): Promise<any> {
    try {
      const sqlResult = "SELECT COUNT(*) as results FROM Result";
      const [{ results }] = await this.db.query(sqlResult, []);

      const sqlUser = "SELECT COUNT(*) as users FROM Account WHERE role = 2";
      const [{ users }] = await this.db.query(sqlUser, []);

      const sqlQuestion = "SELECT COUNT(*) as questions FROM Question";
      const [{ questions }] = await this.db.query(sqlQuestion, []);

      const sqlTest = "SELECT COUNT(*) as tests FROM Test";
      const [{ tests }] = await this.db.query(sqlTest, []);

      const sqlResultPerMonth = `SELECT 
                DATE_FORMAT(startTime, '%m-%Y') AS month_year,
                COUNT(*) AS result_count
            FROM
                Result
            GROUP BY month_year
            ORDER BY month_year;`;
      const resultPerMonth = await this.db.query(sqlResultPerMonth, []);

      const sqlResultPerLevel =
        "SELECT l.name, count(r.id) as result_count FROM Result r INNER JOIN Test t ON r.testId = t.id INNER JOIN Level l ON t.levelId = l.id GROUP BY l.name";
      const resultPerLevel = await this.db.query(sqlResultPerLevel, []);

      const sqlLevel =
        "SELECT l.name, COUNT(*) as total  FROM Test t INNER JOIN Level l ON t.levelId = l.id GROUP BY l.id, l.name;";
      const levels = await this.db.query(sqlLevel, []);
      return {
        results,
        users,
        questions,
        tests,
        resultPerMonth,
        resultPerLevel,
        levels,
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
