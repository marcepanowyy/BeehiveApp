import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrdersRo } from '../orders/orders.dto';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 14)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'The password must contain at least one special character, one uppercase letter and two digits',
  })
  password!: string;

  // @IsNotEmpty()
  // @IsIn([1, 10, 100, 1000], { message: 'Invalid role value' })
  // @ApiProperty({
  //   description:
  //     'The role of the user must be one of the following values: 1, 10, 100, 1000.',
  //   example: 1,
  // })
  // role: number;
}

export class UsersRO {
  id!: string;
  username!: string;
  created?: Date;
  token?: string;
  orders?: OrdersRo[];
  role?: number;
}
