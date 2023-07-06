import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ProductsReviewDto{
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

}