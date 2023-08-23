import { Body, Controller, Post, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

  constructor(private paymentService: PaymentService) {
  }


  @Post()
  async createPayment(@Body() data: CartItem[]){
    return this.paymentService.processPayment(data)
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

