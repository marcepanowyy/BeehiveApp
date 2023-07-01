import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseModule } from '../orm.config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [databaseModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
