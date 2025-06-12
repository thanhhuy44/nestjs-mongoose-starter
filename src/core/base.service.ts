import { Injectable, Logger } from '@nestjs/common';
import { Document } from 'mongoose';

import { IBaseService } from '@/common/interfaces/base-service.interface';
import { IBaseRepository, PaginationResult, QueryOptions } from '@/common/interfaces/base-repository.interface';

@Injectable()
export abstract class BaseService<T extends Document> implements IBaseService<T> {
  protected readonly logger: Logger;

  constructor(
    protected readonly repository: IBaseRepository<T>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Service`);
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = await this.repository.create(data);
      this.logger.log(`Created ${this.entityName} with ID: ${entity._id}`);
      return entity;
    } catch (error) {
      this.logger.error(`Failed to create ${this.entityName}:`, error);
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<PaginationResult<T>> {
    try {
      const result = await this.repository.findAll(options);
      this.logger.log(`Found ${result.items.length} ${this.entityName}s`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName}s:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const entity = await this.repository.findOne(id);
      if (!entity) {
        this.logger.warn(`${this.entityName} not found with ID: ${id}`);
      }
      return entity;
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName} with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const entity = await this.repository.update(id, data as any);
      if (entity) {
        this.logger.log(`Updated ${this.entityName} with ID: ${id}`);
      } else {
        this.logger.warn(`${this.entityName} not found for update with ID: ${id}`);
      }
      return entity;
    } catch (error) {
      this.logger.error(`Failed to update ${this.entityName} with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<T | null> {
    try {
      const entity = await this.repository.softDelete(id);
      if (entity) {
        this.logger.log(`Soft deleted ${this.entityName} with ID: ${id}`);
      } else {
        this.logger.warn(`${this.entityName} not found for deletion with ID: ${id}`);
      }
      return entity;
    } catch (error) {
      this.logger.error(`Failed to delete ${this.entityName} with ID ${id}:`, error);
      throw error;
    }
  }

  // Additional common service methods can be added here
  async count(filter?: Record<string, any>): Promise<number> {
    return this.repository.count(filter as any);
  }

  async exists(id: string): Promise<boolean> {
    const entity = await this.repository.findOne(id);
    return !!entity;
  }
}
