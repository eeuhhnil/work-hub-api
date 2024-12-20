import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRole } from '../../../modules/user/types';
import { USER_ROLE_KEY } from '../decorators/system-role.decorator';
import { AuthPayload } from '../types';

@Injectable()
export class SystemRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      USER_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const { user }: { user: AuthPayload } = request
    if (!requiredRoles.includes(user.role))
      throw new UnauthorizedException("UNAUTHORIZED")

    return true
  }
}
