import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { Account, SearchAccount } from "../models/Account";
import { SearchResult } from "../models/Base";

@injectable()
export class AccountRepository {
  constructor(private db: Database) {}
  async authenticate(
    username: string,
    password: string,
    role: string
  ): Promise<Account> {
    try {
      const sql =
        "SELECT * FROM Account WHERE username = ? AND password = ? AND role = ?";
      const results = await this.db.query(sql, [username, password, role]);
      return results[0];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createAccount(account: Account): Promise<Account> {
    try {
      const sql =
        "INSERT INTO Account(`username`,`password`,`name`,`email`,`phone`,`avatar`,`role`) VALUES (?, ?, ?, ?, ?, ?, ?);";

      await this.db.query(sql, [
        account.username,
        account.password,
        account.name,
        account.email,
        account.phone,
        "/images/user/user-default.png",
        account.role,
      ]);

      const sqlGetNewAccount = "SELECT * FROM Account WHERE username = ?;";
      const [newAccount] = await this.db.query(sqlGetNewAccount, [
        account.username,
      ]);

      return newAccount;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteAccount(username: string): Promise<void> {
    try {
      const sql = "DELETE FROM Account WHERE username = ?";
      await this.db.query(sql, [username]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchAccount(params: SearchAccount): Promise<SearchResult<Account>> {
    try {
      let sql = "SELECT * FROM Account";
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
        "SELECT COUNT(*) AS total FROM Account",
        []
      );
      return { data, total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
