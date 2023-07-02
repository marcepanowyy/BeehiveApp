import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDto, OrdersRo } from './orders.dto';
import { UsersEntity } from '../users/users.entity';
import { ProductsEntity } from '../products/products.entity';
import { ProductWithQuantity } from '../products/products.dto';

// TODO - redis lock on order creating

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
  ) {}

  private toResponseObject(order: OrdersEntity): OrdersRo {
    const responseObject: any = {
      ...order,
      customer: this.toResponseClient(order.customer),
    };
    return responseObject;
  }

  private toResponseClient(client: UsersEntity) {
    const { username, id, ...sth } = client;
    return { username, id };
  }

  private ensureOwnership(idea: OrdersEntity, userId: string) {
    if (idea.customer.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }

  async showAll(): Promise<OrdersRo[]> {
    const orders = await this.ordersRepository.find({
      relations: ['customer'],
    });
    return orders.map(order => this.toResponseObject(order));
  }

  async create(data: OrdersDto, userId: string) {
    const { productsArray } = data;
    const products2: ProductWithQuantity[] = [];
    const products: ProductsEntity[] = [];
    for (const productItem of productsArray) {
      const product = await this.productsRepository.findOne({
        where: { id: productItem.productId },
      });
      if (!product) {
        throw new HttpException("Product's ID not found", HttpStatus.NOT_FOUND);
      }
      if (product.unitsOnStock - productItem.quantity < 0) {
        throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
      } else {
        products2.push({ product, quantity: productItem.quantity });
        products.push({ ...product });
      }
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    for (const productItem of productsArray) {
      const product = await this.productsRepository.findOne({
        where: { id: productItem.productId },
      });
      await this.productsRepository.update(product.id, {
        unitsOnStock: product.unitsOnStock - productItem.quantity,
      });
    }

    // console.log(products);
    // console.log(products2);

    const order = await this.ordersRepository.create({
      products,
      customer: user,
    });

    await this.ordersRepository.save(order);
    return order;
  }

  async read(orderId: string): Promise<OrdersRo> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(order);
  }

  // async update(orderId: string, data: Partial<OrdersDto>): Promise<OrdersRo> {
  //   let order = await this.ordersRepository.findOne({
  //     where: { id: orderId },
  //   });
  //   if (!order) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }
  //   await this.ordersRepository.update({ id: orderId }, data);
  //   order = await this.ordersRepository.findOne({ where: { id: orderId } });
  //   return this.toResponseObject(order);
  // }

  async destroy(orderId: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(order, userId);
    await this.ordersRepository.delete({ id: orderId });
    return this.toResponseObject(order);
  }
}
