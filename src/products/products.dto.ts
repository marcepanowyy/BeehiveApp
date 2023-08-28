import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CategoriesEntity } from '../categories/categories.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { ProductsReviewEntity } from '../products.review/products.review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class ProductsDto {

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)

  @ApiProperty({
    description: 'The name of the product',
    minLength: 10,
    maxLength: 30,
    example: 'Sample Product Name',
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(30, 200)

  @ApiProperty({
    description: 'The description of the product',
    minLength: 30,
    maxLength: 200,
    example:
      'Sample product description, which has a minimum of 30 characters.',
  })
  description!: string;

  @Min(0)
  @IsInt()

  @ApiProperty({
    description: 'The number of units in stock',
    minimum: 0,
    example: 10,
  })
  unitsOnStock!: number;

  @IsInt()
  @Min(1)

  @ApiProperty({
    description: 'The price per unit of the product',
    minimum: 1,
    example: 1999,
  })
  unitPrice!: number;

  @IsNotEmpty()
  @IsString()

  @ApiProperty({ description: 'The ID of the category', example: randomUUID() })
  categoryId!: string;

}

export class FilteredProductsDto {

  @Min(1)

  @ApiProperty({
    description: 'The minimum unit price',
    minimum: 1,
    example: 199,
  })
  minUnitPrice: number;

  @Min(1)

  @ApiProperty({
    description: 'The maximum unit price',
    minimum: 1,
    example: 999,
  })
  maxUnitPrice: number;

  @IsNotEmpty()
  @IsArray()

  @ApiProperty({
    description: 'An array of category IDs',
    example: [randomUUID(), randomUUID()],
  })
  categoryIdArr: string[];

  @ApiProperty({ description: 'Sort in ascending order' })
  ascending: boolean = false;

  @ApiProperty({ description: 'Sort in descending order' })
  descending: boolean = false;

}

export class ProductsRo {

  @ApiProperty({ description: 'The ID of the product', example: randomUUID() })
  id?: string;

  @ApiProperty({ description: 'The creation date of the product' })
  created?: Date;

  @ApiProperty({ description: 'The last update date of the product' })
  updated?: Date;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product Name',
  })
  name!: string;

  @ApiProperty({
    description: 'The description of the product',
    example:
      'Sample product description, which has a minimum of 30 characters.',
  })
  description!: string;

  @ApiProperty({
    description: 'The number of units in stock',
    minimum: 0,
    example: 10,
  })
  unitsOnStock?: number;

  @ApiProperty({
    description: 'The price per unit of the product',
    minimum: 1,
    example: 199,
  })
  unitPrice!: number;

  @ApiProperty({ description: 'The category associated with the product' })
  category?: CategoriesEntity | string;

  @ApiProperty({
    description: 'The list of order details associated with the product',
  })
  orderDetails?: OrderDetailsEntity[];

  @ApiProperty({ description: 'The list of product reviews' })
  reviews?: ProductsReviewEntity[];

}
