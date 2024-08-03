export type Test = {
  id: string;
  title: string;
  image: string;
  levelId: number;
  level: string;
  duration: number;
  questions: number[];
};

export type SearchTest = {
  page: number;
  pageSize: number;
  id?: string;
};
