import { IsNotEmpty, IsString } from 'class-validator';
import { ProductsEntity } from '../products/products.entity';
import { ProductsRo } from '../products/products.dto';

export class CategoriesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

}

export class CategoriesRo {
  id?: string;
  created?: Date;
  updated?: Date;
  name: string;
  description: string;
  products?: ProductsEntity[] | ProductsRo[]
}
