import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import {
  AssetsModule,
  AuthModule,
  PaymentsModule,
  UsersModule,
} from '@/modules';

import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get('MONGO_DB_USERNAME') ?? '';
        const password = configService.get('MONGO_DB_PASSWORD') ?? '';
        const hasAuth = username && password;
        const host = configService.get('MONGO_DB_HOST');
        const port = configService.get('MONGO_DB_PORT');
        const name = configService.get('MONGO_DB_NAME');
        const uri = `mongodb://${username}${hasAuth ? ':' : ''}${password}${hasAuth ? '@' : ''}${host}${port ? ':' : ''}${port}/${name}?authSource=admin`;
        return {
          uri,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        ttl: 1000 * 60 * 5,
        max: 999999,
        store: 'memory',
        isGlobal: true,
      }),
    }),
    CommonModule,
    UsersModule,
    AssetsModule,
    AuthModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
