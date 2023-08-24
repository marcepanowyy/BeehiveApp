import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

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
    console.log(event)
    return true
  }

}


export interface CartItem{
  productId: string,
  quantity: number,
}

export interface ProcessedCartItem {
  productId: string,
  name: string,
  quantity: number,
  price: number
}

