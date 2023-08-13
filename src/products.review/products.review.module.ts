import { Module } from '@nestjs/common';
import { ProductsReviewService } from './products.review.service';
import { ProductsReviewController } from './products.review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsReviewEntity } from './products.review.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { OrdersEntity } from '../orders/orders.entity';
import { ProductsEntity } from '../products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsReviewEntity,
      UsersEntity,
      OrdersEntity,
      ProductsEntity,
    ]),
  ],
  providers: [ProductsReviewService],
  controllers: [ProductsReviewController],
})
export class ProductsReviewModule {}
