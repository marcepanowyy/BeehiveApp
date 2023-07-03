import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { OrdersRo } from '../orders/orders.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 14)
  @ApiProperty({
    description: 'The name of the user',
    example: 'James123',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'The password must contain at least one special character, one uppercase letter and two digits',
  })
  @ApiProperty({
    description:
      'The password of the user - must contain at least one special character, one uppercase letter and two digits',
    example: '#J4n3!Doe#',
  })
  password: string;
}

export class UsersRO {
  id: string;
  username: string;
  created?: Date;
  token?: string;
  orders?: OrdersRo[];
}
