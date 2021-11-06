import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { DatabaseService } from '../database/database.service';
import { GetGroupsRequestDto } from './dto/get-groups-request.dto';
import { GetGroupsResponseDto } from './dto/get-groups-response.dto';

@Injectable()
export class GroupService {
  constructor(private readonly dbService: DatabaseService) {}
  create(userId: number, createGroupDto: CreateGroupDto) {
    return this.dbService.group.create({
      data: {
        name: createGroupDto.name,
        userId,
      },
    });
  }

  async findAllByUserId(userId: number, getGroupsDto: GetGroupsRequestDto) {
    const [data, total] = await this.dbService.$transaction([
      this.dbService.group.findMany({
        skip: (getGroupsDto.page - 1) * getGroupsDto.limit,
        take: getGroupsDto.limit,
        where: {
          userId,
        },
      }),
      this.dbService.group.count({
        where: { userId },
      }),
    ]);
    return { data, total } as GetGroupsResponseDto;
  }

  findOne(id: number, userId: number) {
    return this.dbService.group.findFirst({
      where: { AND: { id, userId } },
    });
  }

  update(id: number, userId: number, updateGroupDto: UpdateGroupDto) {
    return this.dbService.group.updateMany({
      where: { AND: { id, userId } },
      data: {
        name: updateGroupDto.name,
      },
    });
  }

  remove(id: number, userId: number) {
    return this.dbService.group.deleteMany({
      where: { AND: { id, userId } },
    });
  }

  getAllByUserId(userId: number) {
    return this.dbService.group.findMany({
      where: {
        userId,
      },
    });
  }
}
