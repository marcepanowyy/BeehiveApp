import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CartItem, ProcessedCartItem, ProductForOrder } from './payment.dto';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16'
  });

  async processPayment(userId: string, cartItems: CartItem[]) {

    const processedCartItems: ProcessedCartItem[] = await this.getProcessedCartItems(cartItems)
    return this.createSession(userId, processedCartItems)

  }

  async handleStripeEvent(event: any){

    switch (event.type) {

      case 'checkout.session.completed': {

        const session = event.data.object;
        const products = await this.getProductsFromStripeEvent(event)
        const userId = await this.getUserFromStripeEvent(event)

        if (session.payment_status === 'paid') {
          // await this.ordersService.createOrder(userId, products, PaymentStatusEnum.PAID)
        }
        else{
          // await this.ordersService.createOrder(userId, products, PaymentStatusEnum.AWAITING)
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

  }

  async createSession(userId: string, processedCartItems: ProcessedCartItem[]){

    return this.stripe.checkout.sessions.create({
      line_items: processedCartItems.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            images: ['https://material.angular.io/assets/img/examples/shiba1.jpg'], // test img
            metadata: {
              product_id: item.productId
            }
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        userId
      }
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

  async getProductsFromStripeEvent(event: any): Promise<ProductForOrder[]>{

    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items.data.price.product']
      }
    )

    const lineItems = [...sessionWithLineItems.line_items.data];

    return lineItems.map((item: any) => {
      const metadata = item.price.product.metadata
      return {
        productId: metadata.product_id,
        name: item.description,
        quantity: item.quantity,
        currency: item.currency,
        unitAmount: item.price.unit_amount,
        image: item.price.product.images[0],
      }
    })

  }

  async getUserFromStripeEvent(event: any): Promise<string>{

    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items.data']
      }
    )

    const email = sessionWithLineItems.customer_details.email
    const userId = sessionWithLineItems.metadata.userId

    // console.log(email, userId) // check if they are connected -> if not, throw exception

    return sessionWithLineItems.metadata.userId


  }


}


