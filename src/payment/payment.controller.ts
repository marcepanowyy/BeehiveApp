import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CartItem } from './payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';

@Controller('payment')
export class PaymentController {

  constructor(private paymentService: PaymentService) {
  }

  @Post('checkout')
  @UseGuards(new AuthGuard())
  async createPayment(@User('id') userId: string, @Body() cartItems: CartItem[]){
    return this.paymentService.processPayment(userId, cartItems)
  }

  // running stripe listen --forward-to localhost:4000/payment/webhook
  @Post('webhook')
  async handleStripeEvent(@Body() event: any){
    return this.paymentService.handleStripeEvent(event)
  }

}

