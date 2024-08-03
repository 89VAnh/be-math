import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { SearchTest, Test } from "../models/Test";
import { TestRepository } from "../repositories/test.repository";

@injectable()
export class TestService {
  constructor(private testRepository: TestRepository) {}

  async getTest(id: string): Promise<Test | null> {
    const test = await this.testRepository.getTest(id);
    if (test) {
      return test;
    }
    return null;
  }

  async searchTest(params: SearchTest): Promise<SearchResult<Test>> {
    try {
      return await this.testRepository.searchTest(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteTest(id: string): Promise<void> {
    try {
      await this.testRepository.deleteTest(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createTest(test: Test): Promise<Test> {
    try {
      const newTest = await this.testRepository.createTest(test);
      return newTest;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateTest(test: Test): Promise<Test> {
    try {
      const newTest = await this.testRepository.updateTest(test);
      return newTest;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
