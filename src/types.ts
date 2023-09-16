export type ListInput = {
  limit: number;
  skip: number;
};

export type CreateInput = {
  title: string;
  content: string;
};

export type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Result<T> = {
  err: string;
  data: T;
};
