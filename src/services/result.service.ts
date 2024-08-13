import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { Result, SearchResults } from "../models/Result";
import { ResultRepository } from "../repositories/result.repository";

@injectable()
export class ResultService {
  constructor(private resultRepository: ResultRepository) {}

  async getResult(id: number): Promise<Result | null> {
    const result = await this.resultRepository.getResult(id);
    if (result) {
      return result;
    }
    return null;
  }

  async searchResult(params: SearchResults): Promise<SearchResult<Result>> {
    try {
      return await this.resultRepository.searchResult(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteResult(id: number): Promise<void> {
    try {
      await this.resultRepository.deleteResult(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createResult(result: Result): Promise<Result> {
    try {
      const newResult = await this.resultRepository.createResult(result);
      return newResult;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getRankResult(): Promise<any> {
    try {
      return this.resultRepository.getRankResult();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
