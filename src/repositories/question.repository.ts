import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { SearchResult } from "../models/Base";
import { Question, SearchQuestion } from "../models/Question";

@injectable()
export class QuestionRepository {
  constructor(private db: Database) {}
  async getQuestion(id: number): Promise<Question> {
    try {
      const sql = "SELECT * FROM Question WHERE id = ?";
      const results = await this.db.query(sql, [id]);
      return results[0];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createQuestion(question: Question): Promise<any> {
    try {
      const sql =
        "INSERT INTO Question (content, answerA, answerB, answerC, answerD, correctAnswer, levelId) VALUES (?, ?, ?, ?, ?, ?, ?);";
      await this.db.query(sql, [
        question.content,
        question.answerA,
        question.answerB,
        question.answerC,
        question.answerD,
        question.correctAnswer,
        question.levelId,
      ]);

      const getNewSql = "SELECT * FROM Question WHERE id = LAST_INSERT_ID();";
      const [newQuestion] = await this.db.query(getNewSql, []);
      return newQuestion;
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async updateQuestion(question: Question): Promise<Question> {
    try {
      const sql =
        "UPDATE Question SET content = ?, answerA = ?, answerB = ?, answerC = ?, answerD = ?, correctAnswer = ? , levelId = ? WHERE id = ?; ";
      await this.db.query(sql, [
        question.content,
        question.answerA,
        question.answerB,
        question.answerC,
        question.answerD,
        question.correctAnswer,
        question.levelId,
        question.id,
      ]);

      return await this.getQuestion(question.id);
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async deleteQuestion(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM Question WHERE id = ?";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchQuestion(
    params: SearchQuestion
  ): Promise<SearchResult<Question>> {
    try {
      let sql =
        "SELECT q.*, l.name as level FROM Question q INNER JOIN Level l ON q.levelId = l.id";
      const queryParam = [];

      if (params.content !== "" && params.content !== undefined) {
        sql += " WHERE content REGEXP ?";
        queryParam.push(params.content);
      }
      if (params.levelId !== undefined) {
        sql += " WHERE l.id = ?";
        queryParam.push(params.levelId);
      }
      if (params.page != 0 && params.pageSize != 0) {
        const skip: number = (params.page - 1) * params.pageSize;

        sql += " LIMIT ?, ?";
        queryParam.push(skip, Number(params.pageSize));
      }
      const data = await this.db.query(sql, queryParam);

      const [{ total }] = await this.db.query(
        "SELECT COUNT(*) AS total FROM Question",
        []
      );
      return { data, total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
