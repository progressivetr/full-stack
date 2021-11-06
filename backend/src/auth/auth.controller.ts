import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUser } from '../users/user/user.decorator';
import { pick } from 'lodash';
import { JwtUser } from './types/library-ext';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../users/user/user.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged user',
    type: UserDto,
  })
  async login(@AuthUser() user: User): Promise<UserDto> {
    return user;
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      roleId: 1,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@AuthUser() user: JwtUser) {
    return pick(user, ['id', 'email', 'roleId']);
  }
}
