import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../../shared/status.enum';
import { UsersEntity } from '../users/users.entity';
import { ProductsEntity } from '../products/products.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text', { default: StatusEnum.PROCESSING }) status: string;

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.orders)
  customer: UsersEntity;

  @OneToMany(type => ProductsEntity, products => products.order, {cascade: true})
  // @JoinTable({name: "Array of products' id & quantity"})
  products: ProductsEntity[];
  // productsArray: ProductItem[]
}
