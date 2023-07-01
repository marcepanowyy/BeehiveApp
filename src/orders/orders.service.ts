import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDto } from './orders.dto';
import { HttpErrorFilter } from '../../shared/http-error.filter';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private ordersRepository: Repository<OrdersEntity>,
  ) {}

  async showAll(){
    return await this.ordersRepository.find()
  }

  async create(data: OrdersDto){
    const order = this.ordersRepository.create(data)
    await this.ordersRepository.save(order)
    return order
  }

  async read(orderId: string){
    const order = await this.ordersRepository.findOne({where: {id: orderId}})
    if (!order){
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }
    console.log(order)
    return order
  }

  async update(orderId: string, data: Partial<OrdersDto>){
    const order = await this.ordersRepository.findOne({where: {id: orderId}})
    if (!order){
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }
    await this.ordersRepository.update({id: orderId}, data)
    return await this.ordersRepository.findOne({where: {id: orderId}})
  }

  async destroy(orderId: string){
    const order = await this.ordersRepository.findOne({where: {id: orderId}})
    if (!order){
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }
    await this.ordersRepository.delete({id: orderId})
    return order

  }


}
