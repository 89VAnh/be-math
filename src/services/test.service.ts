import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { Question } from "../models/Question";
import { SearchTest, Test } from "../models/Test";
import { ResultRepository } from "../repositories/result.repository";
import { TestRepository } from "../repositories/test.repository";

@injectable()
export class TestService {
  constructor(
    private testRepository: TestRepository,
    private resultRepository: ResultRepository
  ) {}

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

  async submitTest(payload: any): Promise<any> {
    try {
      const test = await this.testRepository.getTest(payload.testId);
      const questitons: Question[] = test?.questions;
      const MAX_SCORE: number = 100;
      const scorePerQuestion: number = MAX_SCORE / questitons.length;

      const score = questitons.reduce((total: number, q: Question) => {
        if (payload.testSubmit[q.id] === q.correctAnswer) {
          return total + scorePerQuestion;
        }
        return total;
      }, 0);
      const result = await this.resultRepository.createResult({
        ...payload,
        score: Math.round(score * 100) / 100,
        testSubmit: JSON.stringify(payload.testSubmit),
      });

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
