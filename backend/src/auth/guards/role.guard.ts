import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as jwt from 'jsonwebtoken';
import { ROLE_KEY } from '../../../shared/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { UserRoleEnum } from '../../../shared/enums/user.role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minLevel = this.reflector.getAllAndOverride<UserRoleEnum>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!minLevel) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth) return false

    const userId = await this.readIdFromToken(auth);
    const userRole = await this.usersService.getRoleByUserId(userId);
    return this.isAuthorized(userRole, minLevel);
  }

  async readIdFromToken(auth: string) {
    const token = auth.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.SECRET);
    return decoded['id'];
  }

  isAuthorized(userRole: UserRoleEnum, authMinLvl: UserRoleEnum): boolean {
    return userRole >= authMinLvl;
  }
}
