import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/pagination.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const users = await this.UserModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.UserModel.countDocuments();
    return {
      data: users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
