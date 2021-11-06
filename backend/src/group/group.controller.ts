import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetGroupsRequestDto } from './dto/get-groups-request.dto';
import { AuthUser } from '../users/user/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(
    @AuthUser('id') userId: number,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.create(userId, createGroupDto);
  }

  @Get('/all')
  getAll(@AuthUser('id') userId: number) {
    return this.groupService.getAllByUserId(userId);
  }

  @Get()
  findAll(
    @AuthUser('id') userId: number,
    @Query() getGroupsDto: GetGroupsRequestDto,
  ) {
    return this.groupService.findAllByUserId(userId, getGroupsDto);
  }

  @Get(':id')
  findOne(@AuthUser('id') userId: number, @Param('id') id: string) {
    return this.groupService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @AuthUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(+id, userId, updateGroupDto);
  }

  @Delete(':id')
  remove(@AuthUser('id') userId: number, @Param('id') id: string) {
    return this.groupService.remove(+id, userId);
  }
}
