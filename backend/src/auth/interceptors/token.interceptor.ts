import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { map, Observable } from 'rxjs';
import type { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.authService.signToken(user);
        response.setHeader('Authorization', `Bearer ${token}`);
        return user;
      }),
    );
  }
}
