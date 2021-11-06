import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { UserService } from '../users/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !compareSync(password, user.password)) {
      return null;
    }
    delete user.password;
    delete user.createdAt;
    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneWithPermissions(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  signToken(user: User): string {
    return this.jwtService.sign({
      id: user.id,
    });
  }
}
