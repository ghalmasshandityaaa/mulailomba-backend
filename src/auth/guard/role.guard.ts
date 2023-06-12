import { IIdentity } from '@mulailomba/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthError } from '../errors';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const identity: IIdentity = request.user;
    const allowedRoles = requiredRoles.includes(identity.role);

    if (!allowedRoles) throw new AuthError.ForbiddenAccess();
    return allowedRoles;
  }
}
