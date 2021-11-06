import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../users/role/enum/permission.enum';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import type { Request } from 'express';
import { JwtUser } from '../types/library-ext';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const user = context.switchToHttp().getRequest<Request>().user as JwtUser;
    for (const permission of user.role.permissions) {
      if (!requiredPermissions.includes(permission.id)) {
        return false;
      }
    }
    return true;
  }
}
