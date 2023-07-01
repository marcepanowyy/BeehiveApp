import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersDto } from './orders.dto';
import { ValidationPipe } from '../../shared/validation.pipe';

@Controller('orders')
export class OrdersController {
  private logger = new Logger('OrdersController');

  constructor(private ordersService: OrdersService) {}

  // private logData(options: any){
  //   options.userId && this.logger.log('USER: ' + JSON.stringify(options.userId));
  //   options.data && this.logger.log('USER DATA: ' + JSON.stringify(options.data));
  //   options.orderId && this.logger.log('ORDER: ' + JSON.stringify(options.orderId));
  // }

  @Get()
  showAllOrders() {
    return this.ordersService.showAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createOrder(@Body() data: OrdersDto) {
    return this.ordersService.create(data);
  }

  @Get(':id')
  readOrder(@Param('id') orderId: string) {
    return this.ordersService.read(orderId);
  }

  @Delete(':id')
  destroyOrder(@Param('id') orderId: string) {
    return this.ordersService.destroy(orderId);
  }
}
