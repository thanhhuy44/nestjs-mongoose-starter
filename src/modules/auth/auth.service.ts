import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User } from '@/modules/users/entities/user.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JWTPayload {
  id: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    private jwtService: JwtService,
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
    const user = await this.UserModel.findOne({
      email: body.email,
      isDeleted: false,
    }).select('+password');
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const isMatchPassword = await bcrypt.compareSync(
      body.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Password not match!');
    }
    const payload = {
      id: user._id.toString(),
      role: user.role,
    };
    const token = await this.token(payload);
    const refreshToken = await this.refreshToken(payload);

    return {
      info: user,
      token,
      refreshToken,
    };
  }

  async token(payload: JWTPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async refreshToken(payload: JWTPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30 days',
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      return {
        accessToken: await this.token({
          id: payload.id,
          role: payload.role,
        }),
        refreshToken: await this.refreshToken({
          id: payload.id,
          role: payload.role,
        }),
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ refresh ~ error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
