import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersDto } from './orders.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import { AuthGuard } from '../../shared/auth.guard';
import { User } from '../users/users.decorator';

@Controller('orders')
export class OrdersController {

  private logger = new Logger('OrdersController');

  constructor(private ordersService: OrdersService) {}

  private logData(options: any){
    options.userId && this.logger.log('USER: ' + JSON.stringify(options.userId));
    options.data && this.logger.log('USER DATA: ' + JSON.stringify(options.data));
    options.orderId && this.logger.log('ORDER: ' + JSON.stringify(options.orderId));
  }

  @Get()
  showAllOrders() {
    return this.ordersService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  // @UsePipes(new ValidationPipe())
  createOrder(@User('id') userId: string, @Body() data: OrdersDto) {
    this.logData({userId, data})
    return this.ordersService.create(data, userId);
  }

  @Get(':id')
  readOrder(@Param('id') orderId: string) {
    return this.ordersService.read(orderId);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyOrder(@Param('id') orderId: string, @User('id') userId: string) {
    this.logData({orderId, userId})
    return this.ordersService.destroy(orderId, userId);
  }
}
