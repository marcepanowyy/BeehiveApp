import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { UsersRO } from '../auth/users/users.dto';
import { ProductsRo } from '../products/products.dto';
import { randomUUID } from 'crypto';

export class ProductsReviewDto {
  
  @IsNotEmpty()
  @IsString()
  @Length(10, 100)
  
  @ApiProperty({
    description: 'The content of the review',
    minLength: 10,
    maxLength: 100,
    example: 'This product is great!',
  })
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  
  @ApiProperty({
    description: 'The rating of the product',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  rating: number;
  
}

export class ReviewRO {

  @ApiProperty({ description: 'The ID of the review', example: randomUUID() })
  id: string;

  @ApiProperty({ description: 'The creation date of the review' })
  created: Date;

  @ApiProperty({ description: 'The last update date of the review' })
  updated?: Date;

  @ApiProperty({
    description: 'The content of the review',
    example: 'This product is great!',
  })
  content: string;

  @ApiProperty({
    description: 'The rating of the product',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  rating: number;

  @ApiProperty({
    description: 'The customer who wrote the review',
    type: UsersRO,
  })
  customer: UsersRO;

  @ApiProperty({
    description: 'The product associated with the review',
    type: ProductsRo,
  })
  product: ProductsRo;

}
