import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth('JWT-Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Numbers of user per page',
    example: 10,
  })
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.usersService.findAll(pagination);
    return data;
  }
}
