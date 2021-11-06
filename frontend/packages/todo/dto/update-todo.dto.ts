import { CreateTodoDto } from "./create-todo.dto";
import { Priority } from "../enum/priority.enum";

export class UpdateTodoDto extends CreateTodoDto {
  id: number;
  isDone: boolean;

  constructor(
    id: number,
    text: string,
    priority: Priority,
    groupId: number,
    dueDate: Date,
    isDone: boolean
  ) {
    super(text, priority, groupId, dueDate);
    this.id = id;
    this.isDone = isDone;
  }
}
