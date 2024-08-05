export type Chat = {
  id: number;
  user: string;
  date: Date;
  content: string;
};
export type SearchChat = {
  page: number;
  pageSize: number;
};
