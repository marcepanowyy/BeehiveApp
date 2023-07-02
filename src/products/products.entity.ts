import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({ type: 'text', unique: true }) name: string;

  @Column('text') description: string;

  @Column('integer') unitsOnStock: number;

  @Column('numeric', { precision: 10, scale: 2 }) price: number;

  // relationships

  // TODO - cascade deleting

  @ManyToOne(type => CategoriesEntity, category => category.products, {
    onDelete: 'CASCADE',
  })
  category: CategoriesEntity;

  @OneToMany(() => OrderDetailsEntity, orderDetail => orderDetail.product)
  orderDetails: OrderDetailsEntity[];

  // end of relationships

}
