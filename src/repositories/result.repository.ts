import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { SearchResult } from "../models/Base";
import { Result, SearchResults } from "../models/Result";

@injectable()
export class ResultRepository {
  constructor(private db: Database) {}
  async getResult(id: number): Promise<any> {
    try {
      const sql = "SELECT * FROM Result WHERE id = ?";
      const results = await this.db.query(sql, [id]);
      const result = results[0];

      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createResult(result: Result): Promise<any> {
    try {
      const sql =
        "INSERT INTO Result (user, testId, startTime, endTime, score, testSubmit) VALUES (?, ?, ?, ?, ?, ?);";

      await this.db.query(sql, [
        result.user,
        result.testId,
        new Date(result.startTime),
        new Date(result.endTime),
        result.score,
        result.testSubmit,
      ]);

      const getNewSql = "SELECT * FROM Result WHERE id = LAST_INSERT_ID();";
      const [newResult] = await this.db.query(getNewSql, []);
      return newResult;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteResult(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM Result WHERE id = ?";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchResult(params: SearchResults): Promise<SearchResult<Result>> {
    try {
      let sql = "SELECT * FROM Result";
      const queryParams = [];
      let sqlTotal = "SELECT COUNT(*) AS total FROM Result";
      const totalParams = [];
      if (params.user !== "" && params.user !== undefined) {
        sql += " WHERE user = ?";
        queryParams.push(params.user);

        sqlTotal += " WHERE user = ?";
        totalParams.push(params.user);
      }

      if (params.page != 0 && params.pageSize != 0) {
        const skip: number = (params.page - 1) * params.pageSize;

        sql += " LIMIT ?, ?";
        queryParams.push(skip, Number(params.pageSize));
      }

      const data = await this.db.query(sql, queryParams);

      const [{ total }] = await this.db.query(sqlTotal, totalParams);

      return {
        data,
        total,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getRankResult(): Promise<any> {
    try {
      let sql =
        "SELECT a.name, a.avatar, COUNT(r.id) as count FROM Account a INNER JOIN Result r ON a.username = r.user GROUP BY a.name, a.avatar";

      const data = await this.db.query(sql, []);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
