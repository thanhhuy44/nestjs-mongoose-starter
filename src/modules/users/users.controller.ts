import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { PaginationDto } from '~/app/dto/pagination.dto';

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
  async findAll(@Query() pagination: PaginationDto, @Res() res: Response) {
    const data = await this.usersService.findAll(pagination);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK!',
      ...data,
    });
  }
}
