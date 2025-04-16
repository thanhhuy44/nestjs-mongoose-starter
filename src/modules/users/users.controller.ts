import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { GetUser } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth('JWT-Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.usersService.findAll(pagination);
    return data;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@GetUser() user: Document<User>) {
    const data = await this.usersService.getMe(user._id.toString());
    return { data };
  }
}
