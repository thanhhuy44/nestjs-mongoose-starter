// src/common/common.module.ts
import { Global, Module } from '@nestjs/common';

import { AppCacheService } from './cache/app-cache.service';

@Global()
@Module({
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class CommonModule {}
