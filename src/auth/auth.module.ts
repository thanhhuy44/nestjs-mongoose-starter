import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserSchema } from '@/users/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenMiddleware } from './refreshToken.middleware';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<User>('save', async function (next) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const user = this;
            if (user.password) {
              const salt = await bcrypt.genSalt();
              const hashPassword = await bcrypt.hash(user.password, salt);
              user.password = hashPassword;
              next();
            }
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes(
      {
        path: '/auth/token',
        method: RequestMethod.GET,
      },
      {
        path: '/auth/refresh-token',
        method: RequestMethod.GET,
      },
    );
  }
}
