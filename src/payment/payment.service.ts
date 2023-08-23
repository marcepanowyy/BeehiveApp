import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CartItem, ProcessedCartItem } from './payment.controller';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private productsService: ProductsService
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
  });

  async processPayment(cartItems) {

    const processedCartItems: ProcessedCartItem[] = await this.getProcessedCartItems(cartItems)
    return this.createSession(processedCartItems)

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
