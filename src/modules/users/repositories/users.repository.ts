import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@/core/repositories/base.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email, isDeleted: false }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.model
      .findOne({ email, isDeleted: false })
      .select('+password')
      .exec();
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.model.countDocuments({ email, isDeleted: false }).exec();
    return count > 0;
  }
}