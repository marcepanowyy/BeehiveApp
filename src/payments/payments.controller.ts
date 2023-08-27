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
import { PaymentsService } from './payments.service';
import { CartItem } from './payments.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';
import { Role } from '../../shared/decorators/roles.decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.CUSTOMER)

  @ApiOperation({ summary: 'Create payment session for checkout' })
  @ApiBody({ type: [CartItem] })
  @ApiCreatedResponse({ description: 'Payment session created successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  async createPayment(
    @User('id') userId: string,
    @Body() cartItems: CartItem[],
  ) {
    const session = await this.paymentService.processPayment(userId, cartItems);
    return {url: session.url}
  }

  // running 'stripe listen --forward-to localhost:4000/payment/webhook' in stripe CLI
  @Post('webhook')

  @ApiOperation({ summary: 'Handle incoming Stripe webhook events' })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  async handleStripeIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new HttpException(
        'Missing stripe-signature header',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event = await this.paymentService.constructEventFromPayload(
      signature,
      req.rawBody,
    );
    return this.paymentService.handleStripeEvent(event);
  }

}
