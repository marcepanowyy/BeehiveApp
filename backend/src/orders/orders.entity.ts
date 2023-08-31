import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { DeliveryStatusEnum } from '../../shared/enums/delivery.status.enum';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('enum', {
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.PROCESSING,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column('enum', {
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.AWAITING,
  })
  paymentStatus: PaymentStatusEnum;

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.orders, {
    onDelete: 'CASCADE',
  })
  customer: UsersEntity;

  @OneToMany(() => OrderDetailsEntity, orderDetail => orderDetail.order)
  orderDetails: OrderDetailsEntity[];

  // end of relationships
}
