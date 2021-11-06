import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from '../../database/database.service';
import { GetRolesDto } from './dto/get-roles.dto';

@Injectable()
export class RoleService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createRoleDto: CreateRoleDto) {
    return this.dbService.role.create({
      data: {
        name: createRoleDto.name,
        permissions: {
          connect: createRoleDto.permissions.map((id) => ({ id })),
        },
      },
    });
  }

  findAll(getRolesDto: GetRolesDto) {
    return this.dbService.role.findMany({
      skip: (getRolesDto.page - 1) * getRolesDto.limit,
      take: getRolesDto.limit,
    });
  }

  findOne(id: number) {
    return this.dbService.role.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.dbService.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        permissions: {
          set: updateRoleDto.permissions.map((id) => ({ id })),
        },
      },
    });
  }

  remove(id: number) {
    return this.dbService.user.delete({
      where: { id },
    });
  }
}
