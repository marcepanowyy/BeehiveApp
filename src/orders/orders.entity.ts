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
import { StatusEnum } from '../../shared/enums/status.enum';
import { UsersEntity } from '../users/users.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text', { default: StatusEnum.PROCESSING }) status: string;

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.orders)
  customer: UsersEntity;

  @OneToMany(() => OrderDetailsEntity, orderDetail => orderDetail.order)
  orderDetails: OrderDetailsEntity[];

  // end of relationships
}
