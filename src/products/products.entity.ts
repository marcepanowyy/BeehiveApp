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
import { ProductsReviewEntity } from '../products.review/products.review.entity';

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

  @ManyToOne(type => CategoriesEntity, category => category.products, {
    onDelete: 'CASCADE',
  })
  category: CategoriesEntity;

  @OneToMany(type => OrderDetailsEntity, orderDetail => orderDetail.product)
  orderDetails: OrderDetailsEntity[];

  @OneToMany(type => ProductsReviewEntity, review => review.customer)
  reviews: ProductsReviewEntity[];

  // end of relationships

}
