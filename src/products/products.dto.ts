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

  @IsInt()
  @Min(1)
  unitPrice: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class FilteredProductsDto{

  @Min(1)
  minUnitPrice: number

  @Min(1)
  maxUnitPrice: number

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
  unitPrice: number;
  category?: CategoriesEntity | string;
  orderDetails?: OrderDetailsEntity[];
  reviews?: ProductsReviewEntity[];
}

