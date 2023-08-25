import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CartItem, ProcessedCartItem, ProductForOrder, UserFromStripeEvent } from './payment.dto';
import { OrdersService } from '../orders/orders.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {

  private stripe: Stripe;

  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private mailService: MailService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16'
    });
  }

  async processPayment(userId: string, cartItems: CartItem[]) {

    const processedCartItems: ProcessedCartItem[] = await this.getProcessedCartItems(cartItems)
    return await this.createSession(userId, processedCartItems)

  }

  async handleStripeEvent(event: any){

    const session = event.data.object;

    if(event.type === 'checkout.session'){

      const products = await this.getProductsFromStripeEvent(event)
      const {recipient, userId } = await this.getUserIdFromStripeEvent(event)

      switch (event.type) {

      case 'checkout.session.completed': {

        // check if products currency is the same
        console.log('case checkout session completed')

        if (session.payment_status === 'paid') {

          console.log('case payment status paid')
          // await this.ordersService.createOrder(userId, products, PaymentStatusEnum.PAID)
        }
        else{

          console.log('case else')
          // await this.ordersService.createOrder(userId, products, PaymentStatusEnum.AWAITING)
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {

        console.log('case session async payment succeeded')
        // await this.ordersService.createOrder(userId, products, PaymentStatusEnum.PAID)
        break;

      }

      case 'checkout.session.async_payment_failed': {

        console.log('case session async failed')
        break;
        }
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

  async getUserIdFromStripeEvent(event: any): Promise<UserFromStripeEvent>{

    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items.data']
      }
    )

    const recipient = sessionWithLineItems.customer_details.email
    const userId = sessionWithLineItems.metadata.userId

    // console.log(recipient, userId) // check if they are connected -> if not, throw exception
    return { userId, recipient }

  }

  async constructEventFromPayload(signature: string, payload: Buffer){

    return this.stripe.webhooks.constructEvent(

      payload,
      signature,
      process.env.STRIPE_WHEC_ENDPOINT_SECRET

    )

  }

}


