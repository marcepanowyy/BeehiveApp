import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { UsersRO } from '../users/users.dto';
import { ProductItem, ProductsRo } from '../products/products.dto';
import { UsersEntity } from '../users/users.entity';

export class OrdersDto {
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  productsArray: ProductItem[];
}

export class OrdersRo {
  id?: string;
  updated?: Date;
  created: Date;
  status: string;
  customer?: UsersRO | UsersEntity;
  products?: ProductsRo;
}
