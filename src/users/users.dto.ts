import { IsNotEmpty, IsString } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UsersRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
}
