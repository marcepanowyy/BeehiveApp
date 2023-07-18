import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ProductsEntity } from '../products/products.entity';
import { ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';

export class CategoriesDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 24)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(30, 200)
  description: string;
}

export class CategoriesRo {
  id?: string;
  created?: Date;
  updated?: Date;
  name: string;
  description: string;
  products?: ProductsEntity[] | ProductsRo[];
  orderDetails?: OrderDetailsEntity;
}
