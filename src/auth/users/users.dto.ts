import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { OrdersRo } from '../../orders/orders.dto';

export class UsersDto {
  @IsEmail()
  @Length(6, 28)
  @ApiProperty({
    description: 'The name of the user',
    example: 'James123@gmail.com',
  })
  username!: string;

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
  password!: string;
}

export class UsersRO {
  id!: string;
  username!: string;
  created?: Date;
  token?: string;
  orders?: OrdersRo[];
  role?: number;
  reviews?: ProductsReviewEntity[];
}

export class GoogleUser {
  email?: string;
  lastName?: string;
  firstName?: string;
  picture?: string;
  accessToken?: string;
}
