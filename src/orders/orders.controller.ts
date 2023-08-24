import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { User } from '../../shared/decorators/users.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('orders')
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
  showAllOrders(@Query('page') page: number) {
    return this.ordersService.showAll(page);
  }

  // not valid endpoint anymore - should go through payments first

  // @Post()
  // @UseGuards(new AuthGuard())
  // @UsePipes(new ValidationPipe())
  // createOrder(@User('id') userId: string, @Body() data: OrdersDto) {
  //   this.logData({ userId, data });
  //   return this.ordersService.create(data, userId);
  // }

  @Get('/user')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  showOrdersByUser(@User('id') userId: string, @Query('page') page: number) {
    this.logData({ userId });
    return this.ordersService.getOrdersByUser(userId, page);
  }

  @Get(':id')
  showOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Delete(':id')
  // @UseGuards(new AuthGuard())
  destroyOrder(
    @Param('id') orderId: string,
    @Body('customerId') customerId: string,
  ) {
    return this.ordersService.destroy(orderId, customerId);
  }
}
