import { ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { UsersRO } from '../auth/users/users.dto';
import { DeliveryStatusEnum } from '../../shared/enums/delivery.status.enum';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';

export class OrdersRo {
  id?: string;
  updated?: Date;
  created: Date;
  deliveryStatus: number;
  paymentStatus: number;
  customer?: UsersRO | UsersEntity;
  products?: ProductsRo;
  orderDetails?: OrderDetailsEntity[];
}

export class OrderStatusDto {
  customerId: string;
  deliveryStatus: DeliveryStatusEnum;
  paymentStatus: PaymentStatusEnum;
}
