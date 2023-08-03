import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer{

  constructor(@Inject(UsersService) private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UsersEntity, done: Function): any {
    done(null, user)
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.usersService.findUserById(payload.id)
    return user ? done(null, user) : done(null, null)
  }

}