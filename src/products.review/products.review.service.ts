import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsReviewEntity } from './products.review.entity';
import { Repository } from 'typeorm';
import { ProductsEntity } from '../products/products.entity';
import { UsersEntity } from '../auth/users/users.entity';
import { ProductsReviewDto, ReviewRO } from './products.review.dto';
import { OrdersEntity } from '../orders/orders.entity';
import { ProductsRo } from '../products/products.dto';

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

  private toResponseProduct(product: ProductsEntity): ProductsRo {
    const { created, updated, orderDetails, ...responseObject } = product;
    return { ...responseObject };
  }

  private toResponseReview(review: ProductsReviewEntity): ReviewRO {
    const { id, content, rating, created } = review;
    const responseObject: any = {
      id,
      content,
      rating,
      created,
    };
    if (review.customer) {
      responseObject.customer = review.customer.toResponseUser(false);
    }
    if (review.product) {
      responseObject.product = this.toResponseProduct(review.product);
    }
    return responseObject;
  }

  private toResponseReviews(reviews: ProductsReviewEntity[]): ReviewRO[] {
    return reviews.map(review => this.toResponseReview(review));
  }

  async showAll(page: number = 1): Promise<ReviewRO[]> {
    const reviews = await this.productsReviewRepository.find({
      relations: ['customer', 'product'],
      take: 10,
      skip: 10 * (page - 1),
    });
    return this.toResponseReviews(reviews);
  }

  async showReviewById(reviewId: string): Promise<ReviewRO> {
    const review = await this.productsReviewRepository.findOne({
      where: { id: reviewId },
      relations: ['customer', 'product'],
    });
    return this.toResponseReview(review);
  }

  async showReviewsByUser(
    userId: string,
    page: number = 1,
  ) {

    const reviews = await this.productsReviewRepository.find({
      where: {customer: {id: userId}},
      relations: ['customer', 'product'],
      take: 5,
      skip: 5 * (page - 1)
    })

    return this.toResponseReviews(reviews)

  }

  async showReviewsByProduct(
    productId: string,
    page: number = 1,
  ){

    const reviews = await this.productsReviewRepository.find({
      where: {product: {id: productId}},
      relations: ['customer', 'product'],
      take: 5,
      skip: 5 * (page - 1)
    })

    return this.toResponseReviews(reviews)

  }

  async create(userId: string, data: ProductsReviewDto, productId: string) {
    const { content, rating } = data;

    const customer = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!customer) {
      throw new HttpException('User not found by id', HttpStatus.NOT_FOUND);
    }

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException('Product not found by id', HttpStatus.NOT_FOUND);
    }

    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderDetails', 'orderDetails')
      .innerJoin('order.customer', 'customer')
      .where('customer.id = :userId', { userId })
      .andWhere('orderDetails.product.id = :productId', { productId })
      .getOne();

    if (!order) {
      throw new HttpException(
        'User did not purchase the product',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const review = await this.productsReviewRepository.create({
      content,
      rating,
      customer,
      product,
    });

    await this.productsReviewRepository.save(review);
    return this.toResponseReview(review);
  }

  async updateReview(userId: string, reviewId: string, data: Partial<ProductsReviewDto>){

    const review = await this.productsReviewRepository.findOne({where: {id: reviewId}})

    if (!review) {
      throw new HttpException('Review not found by id', HttpStatus.NOT_FOUND);
    }

    await this.productsReviewRepository.update({ id: reviewId }, { ...data })

    const updatedReview = await this.productsReviewRepository.findOne({where: {id: reviewId}})

    return this.toResponseReview(updatedReview)

  }


}
