import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { CACHE_NAME } from '@/configs/redis';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_NAME) private readonly cache: Cacheable) {}

  async getPaginationData<T>(key: string, pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'asc',
    } = pagination;
    // get items from redis
    const items = (await this.cache.get('key')) as T[];

    // Sort the items
    items.sort((a, b) => {
      if (sortDirection === 'asc' || sortDirection === 'ascending') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async add<T>(key: string, value: T): Promise<void> {
    // Get existing items
    const items = ((await this.cache.get(key)) as T[]) || [];
    // Push the new item
    items.push(value);
  }

  async deleteOne<T>(key: string, id: string): Promise<void> {
    // Get existing items
    const items = ((await this.cache.get(key)) as T[]) || [];
    // remove item
    const newItems = items.filter((item) => (item as any)._id !== id);
    // update
    await this.cache.set('key', newItems);
  }

  async clear(key: string) {
    await this.cache.delete(key);
  }
}
