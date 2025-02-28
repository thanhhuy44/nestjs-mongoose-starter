import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from '../auth/auth.middleware';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Asset, AssetSchema } from './entities/asset.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Asset.name,
        schema: AssetSchema,
      },
    ]),
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/assets', '/assets/*');
  }
}
