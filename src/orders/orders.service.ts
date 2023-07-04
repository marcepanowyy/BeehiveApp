import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDto, OrdersRo } from './orders.dto';
import { ProductsEntity } from '../products/products.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { ProductsRo } from '../products/products.dto';
import { UsersRO } from '../users/users.dto';
import { UsersEntity } from '../users/users.entity';
import { StatusEnum } from '../../shared/enums/status.enum';

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

  private toResponseClient(client: UsersEntity): UsersRO {
    const { username, id } = client;
    return { username, id };
  }

  private async toResponseOrder(
    order: OrdersEntity,
    showCustomer: boolean = true,
  ): Promise<OrdersRo> {
    const { id, created, status } = order;

    const orderProducts = await this.getProductsForOrder(order);

    const products = orderProducts.map(orderProduct => ({
      productId: orderProduct.product.id,
      name: orderProduct.product.name,
      price: orderProduct.product.price,
      quantity: orderProduct.quantity,
    }));

    const responseObject: any = {
      orderId: id,
      created,
      status,
      products,
    };

    if (showCustomer)
      responseObject.customer = this.toResponseClient(order.customer);
    return responseObject;
  }

  private async toResponseOrders(
    orders: OrdersEntity[],
    showCustomer: boolean = true,
  ): Promise<OrdersRo[]> {
    return await Promise.all(
      orders.map(
        async order => await this.toResponseOrder(order, showCustomer),
      ),
    );
  }

  async showAll(): Promise<OrdersRo[]> {
    const orders = await this.ordersRepository.find({
      relations: ['customer'],
    });
    return this.toResponseOrders(orders);
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
        throw new HttpException(
          `Insufficient stock for product: ${product.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if(!user) throw new HttpException('Invalid user\'s ID', HttpStatus.NOT_FOUND)

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

  async getOrderById(orderId: string): Promise<OrdersRo> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseOrder(order);
  }

  async getOrdersByUser(userId: string): Promise<OrdersRo[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const orders = await this.ordersRepository.find({
      where: { customer: { id: userId } },
      relations: ['customer'],
    });
    return this.toResponseOrders(orders, false);
  }

  validateStatus(status: string) {
    if (!Object.values(StatusEnum).includes(status as StatusEnum)) {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }
  }

  async getOrdersByUserAndStatus(
    userId: string,
    status: string,
  ): Promise<OrdersRo[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.validateStatus(status);

    const orders = await this.ordersRepository.find({
      where: { customer: { id: userId }, status },
      relations: ['customer'],
    });

    return this.toResponseOrders(orders, false);
  }

  async updateStatusById(orderId: string, status: string, userId: string): Promise<OrdersRo> {
    let order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const user = this.usersRepository.findOne({where: {id: userId}})

    if(order.customer.id !== userId){
      throw new HttpException('Order does not belong to user', HttpStatus.BAD_REQUEST)
    }

    this.validateStatus(status)

    await this.ordersRepository.update({ id: orderId }, {status});
    order = await this.ordersRepository.findOne({ where: { id: orderId } });
    return this.toResponseOrder(order);
  }

  // TODO - fix me - cascade deleting
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
