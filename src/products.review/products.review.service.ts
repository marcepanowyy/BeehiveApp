import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsReviewEntity } from './products.review.entity';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../products/products.entity';
import { UsersEntity } from '../users/users.entity';
import { ProductsReviewDto } from './products.review.dto';
import { OrdersEntity } from '../orders/orders.entity';

@Injectable()
export class ProductsReviewService {
  constructor(
    @InjectRepository(ProductsReviewEntity)
    private productsReviewRepository: Repository<ProductsReviewEntity>,
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(OrdersEntity)
    private ordersRepository: Repository<OrdersEntity>,
  ) {}

  async create(userId: string, data: ProductsReviewDto, productId: string){

    const {content, rating} = data

    const customer = await this.usersRepository.findOne({where: {id: userId}})
    if(!customer){
      throw new HttpException('User not found by id', HttpStatus.NOT_FOUND)
    }

    const product = await this.productsRepository.findOne({where: {id: productId}})
    if(!product){
      throw new HttpException('Product not found by id', HttpStatus.NOT_FOUND)
    }

    // working fine!

    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderDetails', 'orderDetails')
      .innerJoin('order.customer', 'customer')
      .where('customer.id = :userId', { userId })
      .andWhere('orderDetails.product.id = :productId', { productId })
      .getOne();

    if (!order) {
      throw new HttpException('User did not purchase the product', HttpStatus.UNAUTHORIZED);
    }

    const existingReview = await this.productsReviewRepository.createQueryBuilder('review')
      .innerJoin('review.customers', 'customer')
      .innerJoin('review.products', 'product')
      .where('customer.id = :userId', { userId })
      .andWhere('product.id = :productId', { productId })
      .getOne();

    if (existingReview) {
      throw new HttpException('Customer has already submitted a review for this product', HttpStatus.BAD_REQUEST);
    }

    const review = await this.productsReviewRepository.create({
      content,
      rating,
      customers: [customer],
      products: [product]
    });

    await this.productsReviewRepository.save(review)
    return review

  }


}
