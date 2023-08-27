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
import { UserRoleEnum } from '../../shared/enums/user.role.enum';
import { Role } from '../../shared/decorators/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {}

  @Get()
  @Role(UserRoleEnum.ADMIN)
  showAllOrders(@Query('page') page: number) {
    return this.ordersService.showAll(page);
  }

  // not valid endpoint anymore - should go through payments first

  @Get('/user')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.MEMBER)
  @UsePipes(new ValidationPipe())
  showOrdersByUser(@User('id') userId: string, @Query('page') page: number) {
    return this.ordersService.getOrdersByUser(userId, page);
  }

  @Get(':id')
  @Role(UserRoleEnum.MEMBER)
  showOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Delete(':id')
  @Role(UserRoleEnum.ADMIN)
  destroyOrder(
    @Param('id') orderId: string,
    @Body('customerId') customerId: string,
  ) {
    return this.ordersService.destroy(orderId, customerId);
  }
}
