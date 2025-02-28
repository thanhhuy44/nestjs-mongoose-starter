import { Module } from '@nestjs/common';

import { CACHE_NAME, redisConfig } from '@/configs/redis';

import { CacheService } from './cache.service';

@Module({
  providers: [redisConfig, CacheService],
  exports: [CACHE_NAME],
})
export class CacheModule {}
