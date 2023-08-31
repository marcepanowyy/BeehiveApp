import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { OrdersRo } from '../../orders/orders.dto';
import { UserRoleEnum } from '../../../shared/enums/user.role.enum';
import { randomUUID } from 'crypto';

export class UsersDto {

  @IsEmail()
  @Length(6, 28)

  @ApiProperty({
    description: 'The email address of the user',
    minLength: 6,
    maxLength: 28,
    example: 'example.email@gmail.com',
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
    example: 'Ex4Mp!Epa55w()Rd',
    minLength: 6,
    maxLength: 24,
  })
  password: string;
}

export class UsersRO {

  @ApiProperty({ description: 'The ID of the user', example: randomUUID() })
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'example@gmail.com',
  })
  username: string;

  @ApiProperty({ description: 'The creation date of the user' })
  created?: Date;

  @ApiProperty({ description: 'The authentication token of the user' })
  token?: string;

  @ApiProperty({
    description: 'The list of orders associated with the user',
    type: [OrdersRo],
  })
  orders?: OrdersRo[];

  @ApiProperty({
    description: 'The role of the user',
    example: UserRoleEnum.CUSTOMER,
  })
  role?: UserRoleEnum;

  @ApiProperty({
    description: 'The list of product reviews submitted by the user',
    type: [ProductsReviewEntity],
  })
  reviews?: ProductsReviewEntity[];

}

export interface GoogleUser {
  email?: string;
  lastName?: string;
  firstName?: string;
  picture?: string;
  accessToken?: string;
}

export class PasswordResetDto {

  @IsEmail()
  @Length(6, 28)

  @ApiProperty({
    description: 'The email address of the recipient',
    example: 'example@gmail.com',
    minLength: 6,
    maxLength: 28,
  })
  recipient: string;

  @ApiProperty({
    description: 'The verification code',
    example: randomUUID(),
  })
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'The password must contain at least one special character, one uppercase letter and two digits',
  })

  @ApiProperty({
    description: 'The new password for the user',
    example: 'NewP@ssw0rd123',
    minLength: 6,
    maxLength: 24,
  })
  newPassword: string;

}
