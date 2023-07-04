import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Role = (role: number) => SetMetadata(ROLE_KEY, role);
