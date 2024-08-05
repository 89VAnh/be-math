export type Result = {
  id: string;
  user: string;
  testId: number;
  startTime: Date;
  endTime: Date;
  score: number;
  testSubmit: any;
};

export type SearchResults = {
  page: number;
  pageSize: number;
  user: string;
};
