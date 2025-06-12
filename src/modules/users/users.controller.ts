import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/core/base.controller';
import { GetUser } from '~/auth/decorator';

import { AuthGuard } from '../auth/guard';
import { User, UserDocument } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth('JWT-Auth')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController extends BaseController<User> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
  @Get('me')
  async getMe(@GetUser() user: UserDocument) {
    const data = await this.usersService.getMe(user._id.toString());
    return { data };
  }
}
