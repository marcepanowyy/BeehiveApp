import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ProductsEntity } from '../products/products.entity';
import { ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class CategoriesDto {

  @IsNotEmpty()
  @IsString()
  @Length(2, 24)

  @ApiProperty({
    description: 'The name of the category',
    minLength: 2,
    maxLength: 24,
    example: 'Sample Category Name'
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(30, 200)

  @ApiProperty({
    description: 'The description of the category',
    minLength: 30,
    maxLength: 200,
    example: 'Sample category description, which has a minimum of 30 characters.',
  })
  description: string;
}

export class CategoriesRo {

  @ApiProperty({
    description: 'The ID of the category',
    example: randomUUID(),
  })
  id?: string;

  @ApiProperty({ description: 'The creation date of the category' })
  created?: Date;

  @ApiProperty({ description: 'The last update date of the category' })
  updated?: Date;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Sample Category Name',
  })
  name!: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Sample category description, which has a minimum of 30 characters.',
  })
  description!: string;

  @ApiProperty({
    description: 'The list of products associated with the category',
    type: [ProductsEntity, ProductsRo],
  })
  products?: ProductsEntity[] | ProductsRo[];

  @ApiProperty({
    description: 'The order details associated with the category',
    type: OrderDetailsEntity,
  })
  orderDetails?: OrderDetailsEntity;

}
