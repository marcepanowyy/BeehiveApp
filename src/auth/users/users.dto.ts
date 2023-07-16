import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { OrdersRo } from '../../orders/orders.dto';

export class UsersDto {
  @IsEmail()
  @Length(6, 18)

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
  reviews?: ProductsReviewEntity[]
}
