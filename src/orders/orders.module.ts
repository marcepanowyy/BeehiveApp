import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
