import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppCacheService } from '@/common/cache/app-cache.service';
import { BaseService } from '@/core/base.service';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    private readonly CacheService: AppCacheService,
  ) {
    super(UserModel, CacheService);
  }

  async getMe(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }
}
