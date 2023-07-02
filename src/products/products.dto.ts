import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
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

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @IsNotEmpty()
  @IsString()
  categoryName: string

}

export class ProductsRo {
  id?: string;
  created?: Date;
  updated?: Date;
  name: string;
  description: string;
  unitsOnStock: number;
  price: number
  category: CategoriesEntity | string;
}
