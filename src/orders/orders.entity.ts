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

  @Column('integer', { default: DeliveryStatusEnum.PROCESSING }) deliveryStatus: number;

  @Column('integer', {default: PaymentStatusEnum.AWAITING}) paymentStatus: number

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.orders, {
    onDelete: 'CASCADE',
  })
  customer: UsersEntity;

  @OneToMany(() => OrderDetailsEntity, orderDetail => orderDetail.order)
  orderDetails: OrderDetailsEntity[];

  // end of relationships
}
