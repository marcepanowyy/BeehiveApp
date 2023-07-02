import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { UsersRO } from '../users/users.dto';
import { ProductItem, ProductsRo } from '../products/products.dto';

export class OrdersDto {
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  productsArray: ProductItem[];

  // @IsNotEmpty()
  // @IsString()
  status?: string;
}

export class OrdersRo {
  id?: string;
  updated?: Date;
  created: Date;
  status: string;
  customer: UsersRO;
  products: ProductsRo;
}
