import { Priority } from "../enum/priority.enum";

export class CreateTodoDto {
  text!: string;
  priority!: Priority;
  groupId!: number;
  dueDate!: Date;

  constructor(
    text: string,
    priority: Priority | null,
    groupId: number | null,
    dueDate: Date | null
  ) {
    this.text = text;
    if (priority) {
      this.priority = priority;
    }
    if (groupId) {
      this.groupId = groupId;
    }
    if (dueDate) {
      this.dueDate = dueDate;
    }
  }
}
