import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { ProductsEntity } from '../products/products.entity';

@Entity('order_details')
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  // relationships

  @ManyToOne(type => OrdersEntity, order => order.orderDetails)
  order: OrdersEntity;

  @ManyToOne(type => ProductsEntity, product => product.orderDetails)
  product: ProductsEntity;

  // end of relationships

  @Column()
  quantity: number;
}
