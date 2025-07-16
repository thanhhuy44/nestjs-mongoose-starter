import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
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
    const isMatchPassword = bcrypt.compareSync(body.password, user.password);

    if (!isMatchPassword) {
      throw new BadRequestException('Password not match!');
    }
    const payload = {
      id: user._id.toString(),
      role: user.role,
    };
    const [token, refreshToken] = await Promise.all([
      this.token(payload),
      this.refreshToken(payload),
    ]);

    return {
      info: user,
      token,
      refreshToken,
    };
  }

  async token(payload: JWTPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_SECRET_EXPIRE_IN,
    });
  }

  async refreshToken(payload: JWTPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRE_IN,
    });
  }

  async refresh(oldRefreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken);
      const cachedUser = await this.cacheManager.get(`user:${payload.id}`);
      if (!cachedUser) {
        const user = await this.UserModel.findById(payload.id);
        if (!user) {
          throw new NotFoundException('User not found!');
        }
        await this.cacheManager.set(`user:${payload.id}`, user);
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.token({
          id: payload.id,
          role: payload.role,
        }),
        this.refreshToken({
          id: payload.id,
          role: payload.role,
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ refresh ~ error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
