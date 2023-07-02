import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({ type: 'text', unique: true }) name: string;

  @Column('text') description: string;

  @Column('integer') unitsOnStock: number;

  @Column('numeric', {precision: 10, scale: 2}) price: number;

  // relationships

  @ManyToOne(type => CategoriesEntity, category => category.products)
  category: CategoriesEntity

}
