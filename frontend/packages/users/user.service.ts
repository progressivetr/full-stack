import { httpService } from "../../src/services/http.service";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";

export class UserService {
  static changePassword(changePasswordDto: ChangePasswordDto) {
    return httpService.post<void>("user/updatePassword", {
      old: changePasswordDto.oldPassword,
      new: changePasswordDto.newPassword,
    });
  }
}
