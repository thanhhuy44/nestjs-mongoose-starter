import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';

export const CACHE_NAME = 'FILIXER_CACHE';

export const redisConfig = {
  provide: CACHE_NAME,
  useFactory: () => {
    const secondary = createKeyv('redis://localhost:6379');
    return new Cacheable({ secondary, ttl: '4h' });
  },
};
