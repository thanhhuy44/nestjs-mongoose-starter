import { PaginationResult, QueryOptions } from './base-repository.interface';

export interface IBaseService<T> {
  create(data: Partial<T>): Promise<T>;
  findAll(options?: QueryOptions): Promise<PaginationResult<T>>;
  findOne(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  remove(id: string): Promise<T | null>;
}