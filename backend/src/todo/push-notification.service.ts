import { Todo } from '@prisma/client';
import { TodoUtils } from './todo.utils';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PushNotificationService {
  constructor(@InjectQueue('dueDate') private readonly dueDateQueue: Queue) {}

  add(todo: Todo) {
    return this.dueDateQueue.add(
      {
        id: todo.id,
      },
      {
        jobId: todo.id,
        removeOnComplete: true,
        delay: todo.dueDate.getTime() - new Date().getTime(),
        priority: TodoUtils.getPriorityInt(todo.priority),
      },
    );
  }

  async removeIfExists(id: number) {
    const job = await this.dueDateQueue.getJob(id);
    if (job) {
      return job.remove();
    }
  }
}
