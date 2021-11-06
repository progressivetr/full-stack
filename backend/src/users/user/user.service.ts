import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    return this.dbService.user.create({
      data: {
        email: createUserDto.email,
        roleId: createUserDto.roleId,
        password: this.hashPassword(createUserDto.password),
      },
    });
  }

  findAll(getUsersDto: GetUsersDto) {
    return this.dbService.user.findMany({
      skip: (getUsersDto.page - 1) * getUsersDto.limit,
      take: getUsersDto.limit,
    });
  }

  findOne(id: number) {
    return this.dbService.user.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: {
        email: updateUserDto.email,
        roleId: updateUserDto.roleId,
        password: updateUserDto.password
          ? this.hashPassword(updateUserDto.password)
          : undefined,
      },
    });
  }

  remove(id: number) {
    return this.dbService.user.delete({
      where: { id },
    });
  }

  findOneByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  hashPassword(password: string) {
    return hashSync(password, genSaltSync());
  }

  updatePasswordById(id: number, password: string) {
    return this.dbService.user.update({
      where: { id },
      data: {
        password: this.hashPassword(password),
      },
    });
  }

  checkPassword(password: string, encryptedPassword: string) {
    return compareSync(password, encryptedPassword);
  }

  async findOneWithPermissions(id: number) {
    return this.dbService.user.findFirst({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
}
