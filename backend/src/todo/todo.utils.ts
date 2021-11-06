import { Priority } from '@prisma/client';

export class TodoUtils {
  static getPriorityInt(priority: Priority): number {
    switch (priority) {
      case Priority.LOW:
        return 3;
      case Priority.MEDIUM:
        return 2;
      case Priority.HIGH:
        return 1;
    }
  }
}
