import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enums/user.role.enum';

export const ROLE_KEY = 'role';
export const Role = (role: UserRoleEnum) => SetMetadata(ROLE_KEY, role);
