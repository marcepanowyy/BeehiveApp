import { ProductsRo } from '../products/products.dto';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { UsersRO } from '../auth/users/users.dto';
import { DeliveryStatusEnum } from '../../shared/enums/delivery.status.enum';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class OrdersRo {

  @ApiProperty({ description: 'The ID of the order', example: randomUUID() })
  id?: string;

  @ApiProperty({ description: 'The last update date of the order' })
  updated?: Date;

  @ApiProperty({ description: 'The creation date of the order' })
  created!: Date;

  @ApiProperty({
    description: 'The delivery status of the order',
    enum: DeliveryStatusEnum,
    example: DeliveryStatusEnum.DELIVERED,
  })
  deliveryStatus!: DeliveryStatusEnum;

  @ApiProperty({
    description: 'The payment status of the order',
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PAID,
  })
  paymentStatus!: PaymentStatusEnum;

  @ApiProperty({
    description: 'The customer associated with the order',
    type: [UsersRO, UsersEntity],
  })
  customer?: UsersRO | UsersEntity;

  @ApiProperty({
    description: 'The products included in the order',
    type: ProductsRo,
  })
  products?: ProductsRo;

  @ApiProperty({
    description: 'The details of the order',
    type: [OrderDetailsEntity],
  })
  orderDetails?: OrderDetailsEntity[];
}
