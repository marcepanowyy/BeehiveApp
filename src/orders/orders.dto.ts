import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ProductItem, ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../users/users.entity';
import { UsersRO } from '../users/users.dto';
import { StatusEnum } from '../../shared/enums/status.enum';

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
  orderDetails?: OrderDetailsEntity[]
}

export class OrderStatusDto{
  customerId: string;
  status: StatusEnum;
}
