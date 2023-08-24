import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CartItem } from './payment.dto';

@Controller('payment')
export class PaymentController {

  constructor(private paymentService: PaymentService) {
  }

  @Post('checkout')
  async createPayment(@Body() data: CartItem[]){
    return this.paymentService.processPayment(data)
  }

  // running stripe listen --forward-to localhost:4000/payment/webhook
  @Post('webhook')
  async handleStripeEvent(@Body() event: any){
    return this.paymentService.handleStripeEvent(event)
  }

}

