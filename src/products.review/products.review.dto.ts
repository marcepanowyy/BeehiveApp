import { IsNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { UsersRO } from '../users/users.dto';
import { ProductsRo } from '../products/products.dto';

export class ProductsReviewDto{
  @IsNotEmpty()
  @IsString()
  @Length(10, 100)
  content: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

}


export class ReviewRO{
  id: string;
  created: Date;
  updated?: Date;
  content: string;
  rating: number;
  customer: UsersRO;
  product: ProductsRo
}