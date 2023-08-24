import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { CategoriesEntity } from '../categories/categories.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { ProductsReviewEntity } from '../products.review/products.review.entity';

export class ProductsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Min(0)
  @IsInt()
  unitsOnStock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class FilteredProductsDto{

  @Min(0.01)
  minPrice: number

  @Min(0.01)
  maxPrice: number

  @IsNotEmpty()
  @IsString()
  categoryIdArr: string[]

  ascending: boolean = false
  descending: boolean = false
}

export class ProductsRo {
  id?: string;
  created?: Date;
  updated?: Date;
  name: string;
  description: string;
  unitsOnStock?: number;
  price: number;
  category?: CategoriesEntity | string;
  orderDetails?: OrderDetailsEntity[];
  reviews?: ProductsReviewEntity[];
}

