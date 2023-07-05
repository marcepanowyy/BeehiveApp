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
import { OrdersDto, OrderStatusDto } from './orders.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import { User } from '../../shared/decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';

// @ApiTags('orders')
@Controller('orders')
export class OrdersController {

  private logger = new Logger('OrdersController');

  constructor(private ordersService: OrdersService) {}

  private logData(options: any) {
    options.userId &&
      this.logger.log('USER: ' + JSON.stringify(options.userId));
    options.data &&
      this.logger.log('USER DATA: ' + JSON.stringify(options.data));
    options.orderId &&
      this.logger.log('ORDER: ' + JSON.stringify(options.orderId));
  }

  @Get()
  showAllOrders() {
    return this.ordersService.showAll();
  }

  // TODO - add transaction

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createOrder(@User('id') userId: string, @Body() data: OrdersDto) {
    this.logData({ userId, data });
    return this.ordersService.create(data, userId);
  }

  @Get('/user')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  showOrdersByUser(@User('id') userId: string){
    return this.ordersService.getOrdersByUser(userId)
  }

  @Get(':id')
  showOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Get('user/:status')
  @UseGuards(new AuthGuard())
  getOrdersByUserAndStatus(@User('id') userId: string, @Param('status') status: string){
    return this.ordersService.getOrdersByUserAndStatus(userId, status)
  }

  // // TODO - members only
  @Put(':id')
  // @UseGuards(new AuthGuard())
  updateOrderStatusById(@Body() data: OrderStatusDto, @Param('id') orderId: string){
    return this.ordersService.updateStatusById(orderId, data)
  }

  @Delete(':id')
  // @UseGuards(new AuthGuard())
  destroyOrder(@Param('id') orderId: string, @Body('customerId') customerId: string) {
    return this.ordersService.destroy(orderId, customerId);
  }

}
