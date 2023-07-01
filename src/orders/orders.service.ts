import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDto, OrdersRo } from './orders.dto';
import { HttpErrorFilter } from '../../shared/http-error.filter';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  private toResponseObject(order: OrdersEntity): OrdersRo {
    const responseObject: any = {
      ...order,
      customer: order.customer.toResponseObject(false),
    };
    return responseObject;
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

  async create(data: OrdersDto, userId: string): Promise<OrdersRo> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const order = this.ordersRepository.create({ ...data, customer: user });
    console.log(user);
    console.log(order);
    await this.ordersRepository.save(order);
    return this.toResponseObject(order);
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
