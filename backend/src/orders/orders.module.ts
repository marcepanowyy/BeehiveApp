import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './orders.entity';
import { ProductsEntity } from '../products/products.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersEntity } from '../auth/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      UsersEntity,
      ProductsEntity,
      OrderDetailsEntity,
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
