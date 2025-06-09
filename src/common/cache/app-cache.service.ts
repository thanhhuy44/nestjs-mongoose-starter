import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AppCacheService {
  private readonly logger = new Logger(AppCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private hashKey(key: string): string {
    return crypto.createHash('md5').update(key).digest('hex');
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.log(`Getting data with key: ${key}`);
    return await this.cacheManager.get<T>(this.hashKey(key));
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.logger.log(`Setting data with key: ${key}`);
    await this.cacheManager.set(this.hashKey(key), value);
  }

  async delete(key: string): Promise<void> {
    this.logger.log(`Deleting data with key: ${key}`);
    await this.cacheManager.del(this.hashKey(key));
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }
}
