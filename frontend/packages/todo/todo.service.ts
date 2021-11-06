import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { httpService } from "@/services/http.service";

export class TodoService {
  static create(createGroupDto: CreateTodoDto) {
    return httpService.post("todo", {
      text: createGroupDto.text,
      priority: createGroupDto.priority,
      dueDate: createGroupDto.dueDate.getTime(),
      groupId: createGroupDto.groupId,
    });
  }

  static update(updateGroupDto: UpdateTodoDto) {
    return httpService.patch(`todo/${updateGroupDto.id}`, {
      text: updateGroupDto.text,
      priority: updateGroupDto.priority,
      dueDate: updateGroupDto.dueDate.getTime(),
      isDone: updateGroupDto.isDone,
      groupId: updateGroupDto.groupId,
    });
  }

  static remove(id: number) {
    return httpService.delete(`todo/${id}`);
  }

  static setAsActive(id: number) {
    return httpService.patch(`todo/setasactive/${id}`);
  }
}
