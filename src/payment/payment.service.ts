import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CartItem, ProcessedCartItem } from './payment.dto';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private productsService: ProductsService
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16'
  });

  async processPayment(cartItems: CartItem[]) {

    const processedCartItems: ProcessedCartItem[] = await this.getProcessedCartItems(cartItems)
    return this.createSession(processedCartItems)

  }

  async handleStripeEvent(event: any){

    switch (event.type) {

      case 'checkout.session.completed': {

        const session = event.data.object;

        // const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
        //   event.data.object.id,
        //   {
        //     expand: ['line_items']
        //   }
        // )
        // const lineItems = sessionWithLineItems.line_items
        // console.log(lineItems)

        // Save an order in your database, marked as 'awaiting payment'
        // createOrder(session);

        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === 'paid') {
          // fulfillOrder(session);
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {

        const session = event.data.object;
        // Fulfill the purchase...
        // fulfillOrder(session);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;

        // Send an email to the customer asking them to retry their order
        // emailCustomerAboutFailedPayment(session);

        break;
      }
    }

    if(event.type === 'checkout.session.completed'){

      const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ['line_items']
        }
      )
      const lineItems = sessionWithLineItems.line_items
      console.log(lineItems)
      console.log('fulfilling order')

    }


  }

  async createSession(processedCartItems: ProcessedCartItem[]){

    return this.stripe.checkout.sessions.create({
      line_items: processedCartItems.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            images: ['https://material.angular.io/assets/img/examples/shiba1.jpg'] // test img
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
  }

  async getProcessedCartItems(cartItems: CartItem[]): Promise<ProcessedCartItem[]>{

    const processedCartItems: ProcessedCartItem[] = [];

    for(const cartItem of cartItems){

      const product = await this.productsService.read(cartItem.productId)

      if (product.unitsOnStock >= cartItem.quantity) {
        processedCartItems.push(
          {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            name: product.name,
            price: product.price
          });
      } else {
        throw new Error(`Insufficient stock for product ${product.name}.`);
      }
    }

    return processedCartItems
  }



}
