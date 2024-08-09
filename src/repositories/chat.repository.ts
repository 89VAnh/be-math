import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { SearchResult } from "../models/Base";
import { Chat, SearchChat } from "../models/Chat";

@injectable()
export class ChatRepository {
  constructor(private db: Database) {}
  async createChat(chat: Chat): Promise<any> {
    try {
      const sql = "INSERT INTO Chat (user, content) VALUES (?, ?);";
      await this.db.query(sql, [chat.user, chat.content]);

      const getNewSql = "SELECT * FROM Chat WHERE id = LAST_INSERT_ID();";
      const [newChat] = await this.db.query(getNewSql, []);
      return newChat;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async searchChat(params: SearchChat): Promise<SearchResult<Chat>> {
    try {
      let sql =
        "SELECT c.*, a.name as user, a.avatar as avatar FROM Chat c INNER JOIN Account a ON c.user = a.username";
      const queryParam = [];

      let sqlTotal = "SELECT COUNT(*) AS total FROM Chat";
      const totalParams = [];

      if (params.content !== "" && params.content !== undefined) {
        sql += " WHERE content REGEXP ?";
        queryParam.push(params.content);

        sqlTotal += " WHERE content REGEXP ?";
        totalParams.push(params.content);
      }

      // sql += " ORDER BY date DESC";
      sql += " ORDER BY date ASC";

      if (params.page != 0 && params.pageSize != 0) {
        const skip: number = (params.page - 1) * params.pageSize;

        sql += " LIMIT ?, ?";
        queryParam.push(skip, Number(params.pageSize));
      }
      const data = await this.db.query(sql, queryParam);

      const [{ total }] = await this.db.query(sqlTotal, totalParams);
      return { data, total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteChat(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM Chat WHERE id = ?";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
