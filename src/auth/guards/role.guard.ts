import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { ROLE_KEY } from '../../../shared/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
// import { UsersService } from '../users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    // private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authMinLvl = this.reflector.getAllAndOverride<number>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!authMinLvl) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    const id = await this.readIdFromToken(auth);
    // const user = await this.usersSerivce.findById(id)
    // return compare(String(user.role), String(privilegeRoleLvl))

    // TODO - get user id not role and check for credentials in db
    const role = await this.ReadRoleFromToken(auth);
    return this.isAuthorized(role, authMinLvl);
  }

  async readIdFromToken(auth: string) {
    const token = auth.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.SECRET);
    return decoded['id'];
  }

  async ReadRoleFromToken(auth: string): Promise<number> {
    const token = auth.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.SECRET);
    return decoded['role'];
  }

  isAuthorized(userRole: number, authMinLvl: number): boolean {
    return userRole >= authMinLvl;
  }
}
