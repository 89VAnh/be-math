export type Account = {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: number;
  token?: string;
};
export type SearchAccount = {
  page: number;
  pageSize: number;
  name?: string;
};
