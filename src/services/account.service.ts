import { injectable } from "tsyringe";
import { verifyToken } from "../config/jwt";
import { Account, SearchAccount } from "../models/Account";
import { SearchResult } from "../models/Base";
import { AccountRepository } from "../repositories/account.repository";
var md5 = require("md5");

@injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async authenticate(
    accountname: string,
    password: string,
    role: string
  ): Promise<Account | null> {
    const md5_pass = md5(password);
    const account = await this.accountRepository.authenticate(
      accountname,
      md5_pass,
      role
    );
    if (account) {
      return account;
    }
    return null;
  }

  async authorize(token: string) {
    const account_data = verifyToken(token);

    if (account_data == null) throw new Error("Phiên đăng nhập hết hạn");
  }

  async searchAccount(params: SearchAccount): Promise<SearchResult<Account>> {
    try {
      return await this.accountRepository.searchAccount(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteAccount(username: string): Promise<void> {
    try {
      this.accountRepository.deleteAccount(username);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createAccount(account: Account): Promise<Account> {
    try {
      const md5_pass = md5(account.password);
      account = { ...account, password: md5_pass, role: 2 };
      const newAccount = await this.accountRepository.createAccount(account);
      return newAccount;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changePw(payload: any): Promise<any> {
    try {
      if (payload.newPassword === payload.rePassword) {
        const md5_pass = md5(payload?.password);
        const md5_newPassword = md5(payload?.newPassword);
        const newAccount = await this.accountRepository.changePw({
          username: payload?.username,
          password: md5_pass,
          newPassword: md5_newPassword,
        });

        return newAccount;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
