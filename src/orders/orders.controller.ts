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
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';
import { Role } from '../../shared/decorators/roles.decorator';
import { OrdersRo } from './orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {}

  @Get()
  @Role(UserRoleEnum.ADMIN)

  @ApiOperation({ summary: 'Get all orders with pagination' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number })
  @ApiOkResponse({ description: 'List of all orders retrieved successfully with pagination.', type: [OrdersRo] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showAllOrders(@Query('page') page: number) {
    return this.ordersService.showAll(page);
  }

  @Get('/user')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.MEMBER)
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Get orders by user with pagination' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number })
  @ApiOkResponse({ description: 'List of orders for the user retrieved successfully with pagination.', type: [OrdersRo] })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showOrdersByUser(@User('id') userId: string, @Query('page') page: number) {
    return this.ordersService.getOrdersByUser(userId, page);
  }

  @Get(':id')
  @Role(UserRoleEnum.MEMBER)

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiOkResponse({ description: 'Order retrieved successfully.', type: OrdersRo })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Delete(':id')
  @Role(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiOkResponse({ description: 'Order deleted successfully.', type: OrdersRo })
  @ApiNotFoundResponse({ description: 'Order or user not found.' })
  @ApiUnauthorizedResponse({ description: 'Order does not belong to user.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  destroyOrder(
    @Param('id') orderId: string,
    @Body('customerId') customerId: string,
  ) {
    return this.ordersService.destroy(orderId, customerId);
  }

}
