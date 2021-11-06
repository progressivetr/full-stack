import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseService } from '../database/database.service';
import { GetTodosRequestDto } from './dto/get-todos-request.dto';
import { GetTodosResponseDto } from './dto/get-todos-response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TodoUtils } from './todo.utils';
import { PushNotificationService } from './push-notification.service';

@Injectable()
export class TodoService {
  constructor(
    private readonly pushNotifyService: PushNotificationService,
    private readonly dbService: DatabaseService,
  ) {}
  async create(createTodoDto: CreateTodoDto) {
    const result = await this.dbService.todo.create({
      data: {
        text: createTodoDto.text,
        priority: createTodoDto.priority,
        groupId: createTodoDto.groupId,
        dueDate: new Date(createTodoDto.dueDate),
      },
    });
    await this.pushNotifyService.add(result);
    return result;
  }

  async findAll(userId: number, getTodosDto: GetTodosRequestDto) {
    const whereClause = {
      isDone: getTodosDto.isDone,
      groupId: getTodosDto.group,
      priority: {
        in: getTodosDto.priorities,
      },
      dueDate: getTodosDto.startDate
        ? {
            gte: new Date(getTodosDto.startDate),
            lte: new Date(getTodosDto.endDate),
          }
        : undefined,
      group: {
        userId,
      },
    };
    const [data, total] = await this.dbService.$transaction([
      this.dbService.todo.findMany({
        skip: (getTodosDto.page - 1) * getTodosDto.limit,
        take: getTodosDto.limit,
        include: {
          group: true,
        },
        where: whereClause,
      }),
      this.dbService.todo.count({
        where: whereClause,
      }),
    ]);
    return { data, total } as GetTodosResponseDto;
  }

  findOne(id: number) {
    return this.dbService.todo.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const ret = await this.dbService.todo.update({
      where: { id },
      data: {
        text: updateTodoDto.text,
        priority: updateTodoDto.priority,
        groupId: updateTodoDto.groupId,
        dueDate: new Date(updateTodoDto.dueDate),
        isDone: updateTodoDto.isDone,
      },
    });
    if (updateTodoDto.isDone) {
      await this.pushNotifyService.removeIfExists(id);
    } else {
      await this.pushNotifyService.removeIfExists(id);
      await this.pushNotifyService.add(ret);
    }
    return ret;
  }

  remove(id: number) {
    return this.dbService.todo.delete({
      where: { id },
    });
  }

  async setAsActive(id: number, userId: number) {
    const ret = await this.dbService.todo.updateMany({
      where: { AND: { id, group: { userId } } },
      data: {
        isDone: false,
      },
    });
    if (ret.count > 0) {
      const todo = await this.findOne(id);
      await this.pushNotifyService.add(todo);
    }
    return ret;
  }
}
