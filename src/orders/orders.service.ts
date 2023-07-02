import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDto, OrdersRo } from './orders.dto';
import { UsersEntity } from '../users/users.entity';
import { ProductsEntity } from '../products/products.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersRO } from '../users/users.dto';
import { ProductsRo } from '../products/products.dto';

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
    @InjectRepository(OrderDetailsEntity)
    private orderDetailsRepository: Repository<OrderDetailsEntity>,
  ) {}

  private async toResponseOrder(order: OrdersEntity): Promise<OrdersRo> {
    const { id, created, status } = order;

    const orderProducts = await this.getProductsForOrder(order);

    const products = orderProducts.map(orderProduct => ({
      productId: orderProduct.product.id,
      name: orderProduct.product.name,
      price: orderProduct.product.price,
      quantity: orderProduct.quantity,
    }));

    const customer = this.toResponseClient(order.customer);

    const responseObject: any = {
      orderId: id,
      created,
      status,
      customer,
      products,
    };

    return responseObject;
  }

  private async toResponseOrders(orders: OrdersEntity[]): Promise<Promise<OrdersRo>[]>{
    return orders.map(async order => await this.toResponseOrder(order))
  }

  private toResponseClient(client: UsersEntity): UsersRO {
    const { username, id } = client;
    return { username, id };
  }

  // TODO - fix returning type

  private async getProductsForOrder(order: OrdersEntity) {
    return await this.orderDetailsRepository
      .createQueryBuilder('orderDetails')
      .leftJoin('orderDetails.product', 'product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'orderDetails.quantity',
      ])
      .where({ order: order })
      .getMany();
  }


  // TODO - not working
  async showAll() {
    const orders = await this.ordersRepository.find({
      relations: ['customer'],
    });
    return this.toResponseOrders(orders)
    // console.log(orders)
    // return orders.map(order => this.toResponseOrder(order));
  }

  async create(data: OrdersDto, userId: string): Promise<OrdersRo> {
    const { productsArray } = data;
    for (const productItem of productsArray) {
      const product = await this.productsRepository.findOne({
        where: { id: productItem.productId },
      });
      if (!product) {
        throw new HttpException("Product's ID not found", HttpStatus.NOT_FOUND);
      }
      if (product.unitsOnStock - productItem.quantity < 0) {
        throw new HttpException(`Insufficient stock for product: ${product.name}`, HttpStatus.BAD_REQUEST);
      }
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const order = await this.ordersRepository.create({ customer: user });
    await this.ordersRepository.save(order);

    for (const productItem of productsArray) {
      const product = await this.productsRepository.findOne({
        where: { id: productItem.productId },
      });
      await this.productsRepository.update(product.id, {
        unitsOnStock: product.unitsOnStock - productItem.quantity,
      });

      const orderDetails = await this.orderDetailsRepository.create({
        product,
        order,
        quantity: productItem.quantity,
      });

      await this.orderDetailsRepository.save(orderDetails);
    }
    return this.toResponseOrder(order);
  }

  async read(orderId: string): Promise<OrdersRo> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseOrder(order);
  }

  // TODO - updating status???

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


  // TODO - fix me

  async destroy(orderId: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (!(order.customer.id === userId)) {
      throw new HttpException(
        'Order does not belong to user',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.ordersRepository.delete({ id: orderId });
    return this.toResponseOrder(order);
  }
}
