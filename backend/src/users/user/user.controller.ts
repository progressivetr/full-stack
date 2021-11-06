import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { AuthUser } from './user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('updatePassword')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @AuthUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (!this.userService.checkPassword(changePasswordDto.old, user.password)) {
      throw new UnprocessableEntityException('Password is not correct!');
    } else if (
      this.userService.checkPassword(changePasswordDto.new, user.password)
    ) {
      throw new UnprocessableEntityException(
        'Passwords can not not be the same',
      );
    }
    await this.userService.updatePasswordById(user.id, changePasswordDto.new);
  }

  @Get()
  findAll(@Query() getUsersDto: GetUsersDto) {
    return this.userService.findAll(getUsersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
