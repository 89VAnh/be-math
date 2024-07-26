import { injectable } from "tsyringe";
import { verifyToken } from "../config/jwt";
import { Account, SearchAccount, SearchAccountResult } from "../models/account";
import { AccountRepository } from "../repositories/account.repository";
var md5 = require("md5");

@injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async authenticate(
    accountname: string,
    password: string,
    role: string
  ): Promise<any> {
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

  async searchAccount(params: SearchAccount): Promise<SearchAccountResult> {
    try {
      return await this.accountRepository.searchAccount(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteAccount(username: string): Promise<any> {
    try {
      return await this.accountRepository.deleteAccount(username);
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
}
