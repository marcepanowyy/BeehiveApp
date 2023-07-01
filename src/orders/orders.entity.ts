import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusEnum } from '../../shared/status.enum';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  // userId

  // products[]

  @Column('text', {default: StatusEnum.PROCESSING}) status : string;
}
