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

  @Column('integer') unitPrice: number;

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

// todo - add currency field

// todo - add product price history entity, when updating price - old price goes to this table
//  with its creation date and end date
