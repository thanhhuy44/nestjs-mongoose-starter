import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { AuthMiddleware } from '../auth/auth.middleware';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/users', '/users/*');
  }
}
