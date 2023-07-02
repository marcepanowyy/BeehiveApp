import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './orders.entity';
import { UsersEntity } from '../users/users.entity';
import { ProductsEntity } from '../products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, UsersEntity, ProductsEntity])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
