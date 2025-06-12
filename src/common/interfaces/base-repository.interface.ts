import { Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  select?: string;
  populate?: string | Record<string, any> | Array<string | Record<string, any>>;
}

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findAll(options?: QueryOptions): Promise<PaginationResult<T>>;
  findOne(id: string): Promise<T | null>;
  findByFilter(filter: FilterQuery<T>): Promise<T | null>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  softDelete(id: string): Promise<T | null>;
  count(filter?: FilterQuery<T>): Promise<number>;
}