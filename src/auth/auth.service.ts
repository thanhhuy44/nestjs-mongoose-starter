import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

import { User } from '@/users/entities/user.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async register(body: RegisterDto) {
    const existUser = await this.UserModel.findOne({ email: body.email });
    if (existUser) {
      throw new ConflictException('Email already exist!');
    }
    const newUser = await this.UserModel.create(body);
    return newUser;
  }

  async login(body: LoginDto) {
    const user = await this.UserModel.findOne({ email: body.email }).select(
      '+password',
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const isMatchPassword = await bcrypt.compare(body.password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Password not match!');
    }
    const { token } = await this.token(user._id.toString());
    const { refreshToken } = await this.refreshToken(user._id.toString());

    return {
      info: user,
      token,
      refreshToken,
    };
  }

  async token(id: string) {
    try {
      const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60,
      });
      return { token };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(id: string) {
    try {
      const refreshToken = jwt.sign(
        { id },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: '2 days',
        },
      );
      return { refreshToken };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
