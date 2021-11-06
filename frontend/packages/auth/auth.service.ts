import { httpService } from "@/services/http.service";
import { LoginDto } from "./dto/login.dto";
import { AuthUserDto } from "./dto/auth-user.dto";

export class AuthService {
  static login(credentials: LoginDto) {
    return httpService.post<AuthUserDto>("auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
  }

  static register(credentials: LoginDto) {
    return httpService.post("auth/register", {
      email: credentials.email,
      password: credentials.password,
    });
  }

  static getMe() {
    return httpService.get<AuthUserDto>("auth/me");
  }
}
