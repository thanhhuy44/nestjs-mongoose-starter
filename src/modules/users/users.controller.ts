import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ParseObjectIdPipe } from '@/common/pipe/parse-object-id.pipe';
import { GetUser } from '~/auth/decorator';
import { AuthGuard } from '../auth/guard';
import { User, UserDocument } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserPaginatedResponseDto } from './dto/user-response.dto';
import { QueryDto } from '@/common/dto/query.dto';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Users')
@ApiBearerAuth('JWT-Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user.toObject());
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: UserPaginatedResponseDto 
  })
  async findAll(@Query() query: QueryDto): Promise<UserPaginatedResponseDto> {
    const result = await this.usersService.findAll(query);
    return {
      items: result.items.map(user => new UserResponseDto(user.toObject())),
      pagination: result.pagination,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    type: UserResponseDto 
  })
  async getMe(@GetUser() user: UserDocument): Promise<UserResponseDto> {
    return await this.usersService.getMe(user._id.toString());
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user.toObject());
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateProfile(
    @GetUser() user: UserDocument,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return await this.usersService.updateProfile(user._id.toString(), updateUserDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user.toObject());
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<UserResponseDto> {
    const user = await this.usersService.remove(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user.toObject());
  }
}
