import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { BaseService } from '@/core/base.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository, 'User');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user.toObject());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findByEmailWithPassword(email);
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // If email is being updated, check if it's already taken
    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ConflictException('Email already exists');
      }
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, updatedUser.toObject());
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
