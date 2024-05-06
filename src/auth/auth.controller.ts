import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(body);

    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: 'OK!',
      data,
    });
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(body);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK!',
      data,
    });
  }

  @Get('/token')
  async token(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.token(req.userRefresh);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK!',
      data,
    });
  }

  @Get('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.refreshToken(req.userRefresh);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK!',
      data,
    });
  }
}
