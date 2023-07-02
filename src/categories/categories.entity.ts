import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductsDto } from '../products/products.dto';
import { ProductsEntity } from '../products/products.entity';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({ type: 'text', unique: true }) name: string;

  @Column('text') description: string;

  //relationships

  @OneToMany(type => ProductsEntity, product => product.category, {
    cascade: true,
  })
  products: ProductsEntity[];
}
