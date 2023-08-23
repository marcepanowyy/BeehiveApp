import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ProductItem, ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { UsersRO } from '../auth/users/users.dto';
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
  status: number;
  customer?: UsersRO | UsersEntity;
  products?: ProductsRo;
  orderDetails?: OrderDetailsEntity[]
}

export class OrderStatusDto{
  customerId: string;
  status: StatusEnum;
}


export interface PaymentRequestBody {
  products: PaymentProduct[];
  currency: string
}

export interface PaymentProduct {
  id: string,
  title: string,
  price: number,
  quantity: number
}