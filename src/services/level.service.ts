import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { Level, SearchLevel } from "../models/Level";
import { LevelRepository } from "../repositories/level.repository";

@injectable()
export class LevelService {
  constructor(private levelRepository: LevelRepository) {}

  async getLevel(id: number): Promise<Level | null> {
    const level = await this.levelRepository.getLevel(id);
    if (level) {
      return level;
    }
    return null;
  }

  async searchLevel(params: SearchLevel): Promise<SearchResult<Level>> {
    try {
      return await this.levelRepository.searchLevel(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteLevel(id: number): Promise<void> {
    try {
      await this.levelRepository.deleteLevel(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createLevel(level: Level): Promise<Level> {
    try {
      const newLevel = await this.levelRepository.createLevel(level);
      return newLevel;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateLevel(level: Level): Promise<Level> {
    try {
      const newLevel = await this.levelRepository.updateLevel(level);
      return newLevel;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
