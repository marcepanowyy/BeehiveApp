import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [
    TypeOrmModule.forFeature([ProductsEntity]),
    ProductsModule,
    OrdersModule,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
