import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { BullModule } from '@nestjs/bull';
import { PushNotificationService } from './push-notification.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PushNotificationService],
  imports: [
    BullModule.registerQueue({
      name: 'dueDate',
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
  ],
})
export class TodoModule {}
