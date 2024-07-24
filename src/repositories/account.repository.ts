import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { Account } from "../models/account";

@injectable()
export class AccountRepository {
  constructor(private db: Database) {}
  async authenticate(username: string, password: string): Promise<Account> {
    try {
      const sql = "SELECT * FROM account WHERE username = ? AND password = ?";
      const results = await this.db.query(sql, [username, password]);
      return results[0];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  //   async createAccount(account: Account): Promise<any> {
  //     try {
  //       const sql =
  //         "CALL InsertAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@err_code, @err_msg)";
  //       await this.db.query(sql, [
  //         account.account_id,
  //         account.profile_id,
  //         account.account_name,
  //         account.password,
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
  //         account.is_guest,
  //         account.created_by_account_id,
  //       ]);
  //       return true;
  //     } catch (error: any) {
  //       throw new Error(error.message);
  //     }
  //   }

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

  async searchAccount(
    page: number,
    page_size: number
    // account_name: string,
  ): Promise<Account[]> {
    const skip = (page - 1) * page_size;

    try {
      const sql = "SELECT * FROM account LIMIT ?, ?";
      const results = await this.db.query(sql, [skip, page_size]);
      return results;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
