import { User, Role, Permission } from '@prisma/client';

export type JwtUser = User & { role: Role & { permissions: Permission[] } };

declare module 'express' {
  export interface Request {
    user?: JwtUser;
  }
}
