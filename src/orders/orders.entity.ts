import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../shared/status.enum';
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

  // products[]
}
