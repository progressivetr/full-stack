import { CreateGroupDto } from "./dto/create-group.dto";
import { httpService } from "@/services/http.service";
import { UpdateGroupDto } from "./dto/update-group.dto";

export class GroupService {
  static findAll() {
    return httpService.get("group/all");
  }

  static create(createGroupDto: CreateGroupDto) {
    return httpService.post("group", createGroupDto);
  }

  static update(updateGroupDto: UpdateGroupDto) {
    return httpService.patch(`group/${updateGroupDto.id}`, {
      name: updateGroupDto.name,
    });
  }

  static remove(id: number) {
    return httpService.delete(`group/${id}`);
  }
}
