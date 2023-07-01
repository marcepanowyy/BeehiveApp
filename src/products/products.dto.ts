import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';
import { CategoriesEntity } from '../categories/categories.entity';

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

  @IsPositive()
  price: number;

  // category: CategoriesEntity
}

export class ProductsRo {
  id?: string;
  created: Date;
  updated: Date;
  name: string;
  description: string;
  // category: CategoriesEntity;
}
