import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order.details.service';

@Module({
  providers: [OrderDetailsService]
})
export class OrderDetailsModule {}
