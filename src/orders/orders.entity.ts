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
import { UsersEntity } from '../auth/users/users.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('integer', { default: StatusEnum.PROCESSING }) status: number;

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.orders, {
    onDelete: 'CASCADE',
  })
  customer: UsersEntity;

  @OneToMany(() => OrderDetailsEntity, orderDetail => orderDetail.order)
  orderDetails: OrderDetailsEntity[];

  // end of relationships
}
