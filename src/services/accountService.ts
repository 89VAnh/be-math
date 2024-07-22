import { injectable } from "tsyringe";
import { verifyToken } from "../config/jwt";
import { AccountRepository } from "../repositories/accountRepository";
var md5 = require("md5");

@injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async authenticate(accountname: string, password: string): Promise<any> {
    let md5_pass = md5(password);
    let account = await this.accountRepository.authenticate(
      accountname,
      md5_pass
    );
    if (account) {
      return account;
    }
    return null;
  }

  async authorize(token: string) {
    let account_data = verifyToken(token);
    console.log(account_data);

    if (account_data == null) throw new Error("Phiên đăng nhập hết hạn");
  }
}
