import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Req,
  HttpException,
  HttpStatus,
  RawBodyRequest,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CartItem } from './payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';
import { Stripe } from 'stripe';

@Controller('payment')
export class PaymentController {

  constructor(private paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(new AuthGuard())
  async createPayment(@User('id') userId: string, @Body() cartItems: CartItem[]){
    return this.paymentService.processPayment(userId, cartItems)
  }

  // running 'stripe listen --forward-to localhost:4000/payment/webhook' in stripe CLI
  @Post('webhook')
  async handleStripeIncomingEvents(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>){

    if (!signature) {
      throw new HttpException('Missing stripe-signature header', HttpStatus.BAD_REQUEST);
    }

    const event = await this.paymentService.constructEventFromPayload(signature, req.rawBody);
    return this.paymentService.handleStripeEvent(event)

  }



}

