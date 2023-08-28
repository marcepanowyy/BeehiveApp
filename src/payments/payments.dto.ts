import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { randomUUID } from 'crypto';

export class CartItem {

  @ApiProperty({ description: 'The ID of the product', example: randomUUID() })
  productId!: string;

  @IsInt()
  @Min(1)

  @ApiProperty({
    description: 'The quantity of the product',
    example: 2,
    minimum: 1,
  })
  quantity!: number;

}

export class ProcessedCartItem {

  @ApiProperty({ description: 'The ID of the product', example: randomUUID() })
  productId!: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product Name',
  })
  name!: string;

  @Min(1)

  @ApiProperty({
    description: 'The quantity of the product',
    example: 3,
    minimum: 1,
  })
  quantity!: number;

  @Min(1)

  @ApiProperty({
    description: 'The unit price of the product',
    example: 999,
    minimum: 1,
  })
  unitPrice!: number;

}

export class ProductForOrder {

  @ApiProperty({ description: 'The ID of the product', example: randomUUID() })
  productId!: string;

  @Min(1)

  @ApiProperty({
    description: 'The quantity of the product',
    example: 5,
    minimum: 1,
  })
  quantity!: number;

  @ApiProperty({ description: 'The currency', example: 'USD' })
  currency!: string;

}

export class UserFromStripeEvent {

  @ApiProperty({ description: 'The ID of the user', example: randomUUID() })
  userId!: string;

  @ApiProperty({
    description: 'The email address of the recipient',
    example: 'recipient@example.com',
  })
  recipient!: string;

}

export class ProductFromEvent {

  @ApiProperty({ description: 'The ID of the product', example: randomUUID() })
  productId!: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product Name',
  })
  name!: string;

  @Min(1)

  @ApiProperty({
    description: 'The quantity of the product',
    example: 4,
    minimum: 1,
  })
  quantity!: number;

  @ApiProperty({ description: 'The currency', example: 'USD' })
  currency!: string;

  @Min(1)

  @ApiProperty({
    description: 'The unit amount of the product',
    example: 1999,
    minimum: 1,
  })
  unitAmount!: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
  })
  image!: string | null;

}
