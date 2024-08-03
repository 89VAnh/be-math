import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { SearchResult } from "../models/Base";
import { Level, SearchLevel } from "../models/Level";

@injectable()
export class LevelRepository {
  constructor(private db: Database) {}
  async getLevel(id: number): Promise<Level> {
    try {
      const sql = "SELECT * FROM Level WHERE id = ?";
      const results = await this.db.query(sql, [id]);
      return results[0];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createLevel(level: Level): Promise<any> {
    try {
      const sql = "INSERT INTO Level (name) VALUES (?);";
      await this.db.query(sql, [level.name]);

      const getNewSql = "SELECT * FROM Level WHERE id = LAST_INSERT_ID();";
      const [newLevel] = await this.db.query(getNewSql, []);
      return newLevel;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateLevel(level: Level): Promise<Level> {
    try {
      const sql = "UPDATE Level SET name = ? WHERE id = ?; ";
      await this.db.query(sql, [level.name, level.id]);
      const getNewSql = "SELECT * FROM Level WHERE id = ?;";
      const [newLevel] = await this.db.query(getNewSql, [level.id]);

      return newLevel;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteLevel(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM Level WHERE id = ?";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchLevel(params: SearchLevel): Promise<SearchResult<Level>> {
    try {
      let sql = "SELECT * FROM Level";
      const queryParam = [];

      if (params.name !== "" && params.name !== undefined) {
        sql += " WHERE name REGEXP ?";
        queryParam.push(params.name);
      }
      if (params.page != 0 && params.pageSize != 0) {
        const skip: number = (params.page - 1) * params.pageSize;

        sql += " LIMIT ?, ?";
        queryParam.push(skip, Number(params.pageSize));
      }
      const data = await this.db.query(sql, queryParam);

      const [{ total }] = await this.db.query(
        "SELECT COUNT(*) AS total FROM Level",
        []
      );
      return { data, total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
