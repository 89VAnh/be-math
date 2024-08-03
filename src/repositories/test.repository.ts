import { injectable } from "tsyringe";
import { Database } from "../config/database";
import { SearchResult } from "../models/Base";
import { Question } from "../models/Question";
import { SearchTest, Test } from "../models/Test";

@injectable()
export class TestRepository {
  constructor(private db: Database) {}
  async getQuestions(testId: string): Promise<number[]> {
    try {
      const sql = "SELECT questionId FROM TestQuestion WHERE testId = ?";
      const results = await this.db.query(sql, [testId]);
      const data = results.map((question: any) => question.questionId);
      return data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getFullQuestions(testId: string): Promise<Question[]> {
    try {
      const sql =
        "SELECT q.* FROM Question q INNER JOIN TestQuestion tq ON q.id = tq.questionId WHERE testId = ?";
      const results = await this.db.query(sql, [testId]);
      return results;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getTest(id: string): Promise<Test> {
    try {
      const sql = "SELECT * FROM Test WHERE id = ?";
      const results = await this.db.query(sql, [id]);
      const test = results[0];

      test.questions = await this.getFullQuestions(test.id);

      return test;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createTest(test: Test): Promise<any> {
    try {
      const sql =
        "INSERT INTO Test (id, title, image, levelId , duration) VALUES (?, ?, ?, ?, ?);";

      await this.db.query(sql, [
        test.id,
        test.title,
        test.image,
        test.levelId,
        test.duration,
      ]);

      if (test.questions)
        test.questions.forEach(async (questionId: number) => {
          const insertTestQuestionSql =
            "INSERT INTO TestQuestion (testId, questionId) VALUES (?, ?);";
          await this.db.query(insertTestQuestionSql, [test.id, questionId]);
        });

      const getNewSql = "SELECT * FROM Test WHERE id = LAST_INSERT_ID();";
      const [newTest] = await this.db.query(getNewSql, []);
      return newTest;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateTest(test: Test): Promise<Test> {
    try {
      const sql =
        "UPDATE Test SET title = ?, image = ?, levelId = ? , duration = ? WHERE id = ?; ";
      await this.db.query(sql, [
        test.title,
        test.image,
        test.levelId,
        test.duration,
        test.id,
      ]);

      const questions = await this.getQuestions(test.id);

      if (test.questions)
        test.questions.forEach(async (questionId: number) => {
          if (!questions.includes(questionId)) {
            const insertTestQuestionSql =
              "INSERT INTO TestQuestion (testId, questionId) VALUES (?, ?);";
            await this.db.query(insertTestQuestionSql, [test.id, questionId]);
          }
        });

      questions.forEach(async (questionId: number) => {
        if (!(test.questions || []).includes(questionId)) {
          const deleteTestQuestionSql =
            "DELETE FROM TestQuestion WHERE testId = ? AND questionId = ?;";
          await this.db.query(deleteTestQuestionSql, [test.id, questionId]);
        }
      });

      return await this.getTest(test.id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteTest(id: string): Promise<void> {
    try {
      const sql = "DELETE FROM Test WHERE id = ?";
      await this.db.query(sql, [id]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async searchTest(params: SearchTest): Promise<SearchResult<Test>> {
    try {
      let sql =
        "SELECT t.*, l.name as level FROM Test t INNER JOIN Level l ON t.levelId = l.id";
      const queryParam = [];

      if (params.id !== "" && params.id !== undefined) {
        sql += " WHERE t.id REGEXP ?";
        queryParam.push(params.id);
      }
      if (params.page != 0 && params.pageSize != 0) {
        const skip: number = (params.page - 1) * params.pageSize;

        sql += " LIMIT ?, ?";
        queryParam.push(skip, Number(params.pageSize));
      }

      const results = await this.db.query(sql, queryParam);
      const data = await Promise.all(
        results.map(async (test: Test) => {
          test.questions = await this.getQuestions(test.id);
          return test;
        })
      );
      const [{ total }] = await this.db.query(
        "SELECT COUNT(*) AS total FROM Test",
        []
      );

      return {
        data,
        total,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
