export type Account = {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: number;
};
export type SearchAccount = {
  page: number;
  pageSize: number;
};

export type SearchAccountResult = {
  data: Account[];
  total: number;
};
