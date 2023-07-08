import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { ProductsEntity } from '../products/products.entity';


// unique field: (customerId, productId)
// (customer cant post more than 1 review of certain product)

@Entity('reviews')
@Unique(['customer', 'product'])
export class ProductsReviewEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') content: string;

  @Column('integer') rating: number;

  // relationships

  @ManyToOne(type => UsersEntity, customer => customer.reviews)
  customer: UsersEntity;

  @ManyToOne(type => ProductsEntity, product => product.reviews)
  product: ProductsEntity;

  // end of relationships
}
