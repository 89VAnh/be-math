import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { Account, SearchAccount, SearchAccountResult } from "../models/account";

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
        "SELECT * FROM account WHERE username = ? AND password = ? AND role = ?";
      const results = await this.db.query(sql, [username, password, role]);
      return results[0];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createAccount(account: Account): Promise<any> {
    try {
      const sql =
        "INSERT INTO account(`username`,`password`,`name`,`email`,`phone`,`avatar`,`role`) VALUES (?, ?, ?, ?, ?, ?, ?);";
      await this.db.query(sql, [
        account.username,
        account.password,
        account.name,
        account.email,
        account.phone,
        account.avatar,
        account.role,
      ]);

      return account;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  //   async updateAccount(account: Account): Promise<any> {
  //     try {
  //       const sql =
  //         "CALL UpdateAccount(?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, @err_code, @err_msg)";
  //       await this.db.query(sql, [
  //         account.profile_id,
  //         account.account_id,
  //         account.type,
  //         account.description,
  //         account.first_name,
  //         account.middle_name,
  //         account.last_name,
  //         account.full_name,
  //         account.avatar,
  //         account.gender,
  //         account.date_of_birth,
  //         account.email,
  //         account.phone_number,
  //         account.lu_account_id,
  //       ]);
  //       return true;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  //   async resetPassword(account: Account, password: string): Promise<any> {
  //     try {
  //       const sql = "CALL UpdatePasswordAccount(?, ?, ?, @err_code, @err_msg)";
  //       await this.db.query(sql, [account.email, account.password, account.lu_account_id]);
  //       return password;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  //   async changePassword(account: any): Promise<any> {
  //     try {
  //       const sql = "CALL ChangePasswordAccount(?, ?, ?, ?, ?, @err_code, @err_msg)";
  //       await this.db.query(sql, [
  //         account.account_name,
  //         account.password,
  //         account.new_password,
  //         account.type,
  //         account.lu_account_id,
  //       ]);
  //       return true;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  async deleteAccount(username: string): Promise<any> {
    try {
      const sql = "DELETE FROM account WHERE username = ?";
      await this.db.query(sql, [username]);
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  //   async getAccountById(id: string): Promise<any> {
  //     try {
  //       const sql = "CALL GetAccountById(?, @err_code, @err_msg)";
  //       const [results] = await this.db.query(sql, [id]);
  //       if (Array.isArray(results) && results.length > 0) {
  //         return results[0];
  //       }
  //       return null;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  //   async getFunctionByAccountId(id: string): Promise<any[]> {
  //     try {
  //       const sql = "CALL GetFunctionByAccountId(?, @err_code, @err_msg)";
  //       const [results] = await this.db.query(sql, [id]);
  //       return results;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  //   async getActionByAccountId(id: string): Promise<any[]> {
  //     try {
  //       const sql = "CALL GetActionByAccountId(?, @err_code, @err_msg)";
  //       const [results] = await this.db.query(sql, [id]);
  //       return results;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

  async searchAccount(params: SearchAccount): Promise<SearchAccountResult> {
    const skip: number = (params.page - 1) * params.pageSize;
    try {
      const sql = "SELECT * FROM account LIMIT ?, ?";
      // const data = await this.db.query(sql, [skip, params.pageSize]);
      const data = await this.db.query(sql, [skip, Number(params.pageSize)]);

      const [{ total }] = await this.db.query(
        "SELECT COUNT(*) AS total FROM account",
        []
      );
      return { data, total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
