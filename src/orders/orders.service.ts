import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../products/products.entity';
import { OrderDetailsEntity } from '../order.details/order.details.entity';
import { UsersRO } from '../auth/users/users.dto';
import { UsersEntity } from '../auth/users/users.entity';
import { DeliveryStatusEnum } from '../../shared/enums/delivery.status.enum';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';
import { OrdersRo } from './orders.dto';
import { ProductForOrder } from '../payment/payment.dto';

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
        'product.unitPrice',
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
    const { id, created, deliveryStatus, paymentStatus } = order;

    const orderProducts = await this.getProductsForOrder(order);

    const products = orderProducts.map(orderProduct => ({
      productId: orderProduct.product.id,
      name: orderProduct.product.name,
      unitPrice: orderProduct.product.unitPrice,
      quantity: orderProduct.quantity,
    }));

    const responseObject: any = {
      id,
      created,
      deliveryStatus: DeliveryStatusEnum[deliveryStatus],
      paymentStatus: PaymentStatusEnum[paymentStatus],
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
      orders.map(order => this.toResponseOrder(order, showCustomer)),
    );
  }

  async showAll(page: number = 1): Promise<OrdersRo[]> {
    const orders = await this.ordersRepository.find({
      relations: ['customer'],
      take: 10,
      skip: 10 * (page - 1),
    });
    return this.toResponseOrders(orders);
  }

  // TODO - add transaction
  async createOrder(userId: string, products: ProductForOrder[], paymentStatus: PaymentStatusEnum): Promise<OrdersRo> {
    for (const product of products) {
      const foundProduct = await this.productsRepository.findOne({
        where: { id: product.productId },
      });
      if (!foundProduct) {
        throw new HttpException("Product's ID not found", HttpStatus.NOT_FOUND);
      }
      if (foundProduct.unitsOnStock - product.quantity < 0) {
        throw new HttpException(
          `Insufficient stock for product: ${foundProduct.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException("Invalid user's ID", HttpStatus.NOT_FOUND);

    const order = await this.ordersRepository.create({ customer: user, paymentStatus});
    await this.ordersRepository.save(order);

    for (const product of products) {
      const foundProduct = await this.productsRepository.findOne({
        where: { id: product.productId },
      });
      await this.productsRepository.update(foundProduct.id, {
        unitsOnStock: foundProduct.unitsOnStock - product.quantity,
      });

      const orderDetails = await this.orderDetailsRepository.create({
        product: foundProduct,
        order,
        quantity: product.quantity,
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

  async getOrdersByUser(userId: string, page: number = 1): Promise<OrdersRo[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const take = 6;

    const [orders, totalItems] = await this.ordersRepository.findAndCount({
      where: { customer: { id: userId } },
      relations: ['customer'],
      take,
      skip: take * (page - 1),
    });

    const totalPages = Math.ceil(totalItems / take);

    const responseObject: any = {
      orders: await this.toResponseOrders(orders),
      info: {
        totalPages,
        totalItems,
        pageSize: take,
      },
    };
    return { ...responseObject };
  }

  async destroy(orderId: string, customerId: string): Promise<OrdersRo> {
    const user = await this.usersRepository.findOne({
      where: { id: customerId },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['customer'],
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (order.customer.id !== customerId) {
      throw new HttpException(
        'Order does not belong to user',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleted = this.toResponseOrder({ ...order });
    await this.ordersRepository.delete({ id: orderId });
    return deleted;
  }
}
