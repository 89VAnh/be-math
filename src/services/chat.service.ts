import { injectable } from "tsyringe";
import { SearchResult } from "../models/Base";
import { Chat, SearchChat } from "../models/Chat";
import { ChatRepository } from "../repositories/chat.repository";

@injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async searchChat(params: SearchChat): Promise<SearchResult<Chat>> {
    try {
      return await this.chatRepository.searchChat(params);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createChat(chat: Chat): Promise<Chat> {
    try {
      const newChat = await this.chatRepository.createChat(chat);
      return newChat;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
