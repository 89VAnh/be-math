import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { Question, SearchQuestion } from "../models/Question";
import { QuestionRepository } from "../repositories/question.repository";

@injectable()
export class QuestionService {
  constructor(private questionRepository: QuestionRepository) {}

  async getQuestion(id: number): Promise<Question | null> {
    const question = await this.questionRepository.getQuestion(id);
    if (question) {
      return question;
    }
    return null;
  }

  async searchQuestion(
    params: SearchQuestion
  ): Promise<SearchResult<Question>> {
    try {
      return await this.questionRepository.searchQuestion(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    try {
      await this.questionRepository.deleteQuestion(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createQuestion(question: Question): Promise<Question> {
    try {
      const newQuestion = await this.questionRepository.createQuestion(
        question
      );
      return newQuestion;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateQuestion(question: Question): Promise<Question> {
    try {
      const newQuestion = await this.questionRepository.updateQuestion(
        question
      );
      return newQuestion;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
