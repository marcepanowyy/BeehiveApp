import {
  Column,
  CreateDateColumn,
  Entity, JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { JoinColumn } from 'typeorm/browser';
import { ProductsEntity } from '../products/products.entity';


@Entity('reviews')
export class ProductsReviewEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') content: string;

  @Column('integer') rating: number

  // relationships

  @ManyToMany(type => UsersEntity, customer => customer.reviews)
  @JoinTable({name: 'review_customer_JT'})
  customers: UsersEntity[];

  @ManyToMany(type => ProductsEntity, product => product.reviews)
  @JoinTable({name: 'review_product_JT'})
  products: ProductsEntity[];

  // end of relationships

}
