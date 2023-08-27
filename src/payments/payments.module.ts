import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    TypeOrmModule.forFeature([ProductsEntity]),
    ProductsModule,
    OrdersModule,
    MailingModule
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
