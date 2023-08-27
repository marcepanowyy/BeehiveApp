import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import {
  CartItem,
  ProcessedCartItem,
  ProductForOrder,
  UserFromStripeEvent,
} from './payments.dto';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private mailService: MailingService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

  async processPayment(userId: string, cartItems: CartItem[]) {
    const processedCartItems: ProcessedCartItem[] =
      await this.getProcessedCartItems(cartItems);
    return this.createSession(userId, processedCartItems);
  }

  async handleStripeEvent(event: any) {
    const session = event.data.object;

    if (event.type.startsWith('checkout.session')) {
      const products = await this.getProductsFromStripeEvent(event);
      const { recipient, userId } = await this.getUserIdFromStripeEvent(event);

      switch (event.type) {
        case 'checkout.session.completed': {
          if (session.payment_status === 'paid') {
            await this.ordersService.createOrder(
              userId,
              products,
              PaymentStatusEnum.PAID,
            );
            await this.mailService.sendPaymentConfirmationMail(
              recipient,
              products,
              PaymentStatusEnum.PAID,
            );
          } else {
            await this.ordersService.createOrder(
              userId,
              products,
              PaymentStatusEnum.AWAITING,
            );
            await this.mailService.sendPaymentConfirmationMail(
              recipient,
              products,
              PaymentStatusEnum.AWAITING,
            );
          }
          break;
        }

        // additional payments made after the initial checkout, such as tipping
        // or subscription renewals

        case 'checkout.session.async_payment_succeeded': {
          break;
        }
        case 'checkout.session.async_payment_failed': {
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }
  }

  async createSession(userId: string, processedCartItems: ProcessedCartItem[]) {
    return this.stripe.checkout.sessions.create({
      line_items: processedCartItems.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.unitPrice,
          product_data: {
            name: item.name,
            images: [
              'https://material.angular.io/assets/img/examples/shiba1.jpg',
            ], // test img
            metadata: {
              product_id: item.productId,
            },
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        userId,
      },
    });
  }

  async getProcessedCartItems(
    cartItems: CartItem[],
  ): Promise<ProcessedCartItem[]> {
    const processedCartItems: ProcessedCartItem[] = [];

    for (const cartItem of cartItems) {
      const product = await this.productsService.read(cartItem.productId);

      // quantity condition checked when creating order

      processedCartItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        name: product.name,
        unitPrice: product.unitPrice,
      });
    }

    return processedCartItems;
  }

  async getProductsFromStripeEvent(event: any): Promise<ProductForOrder[]> {
    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items.data.price.product'],
      },
    );

    const lineItems = [...sessionWithLineItems.line_items.data];

    return lineItems.map((item: any) => {
      const metadata = item.price.product.metadata;
      return {
        productId: metadata.product_id,
        name: item.description,
        quantity: item.quantity,
        currency: item.currency,
        unitAmount: item.price.unit_amount,
        image: item.price.product.images[0],
      };
    });
  }

  async getUserIdFromStripeEvent(event: any): Promise<UserFromStripeEvent> {
    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items.data'],
      },
    );

    const recipient = sessionWithLineItems.customer_details.email;
    const userId = sessionWithLineItems.metadata.userId;
    return { userId, recipient };
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WHEC_ENDPOINT_SECRET,
    );
  }
}
