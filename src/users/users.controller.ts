import {
  Body,
  Controller,
  Get,
  Param,
  Post, Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';
import { Role } from '../../shared/decorators/roles.decorator';
import { ValidationPipe } from '../../shared/validation.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // TODO - admin only
  @Get()
  @UseGuards(new AuthGuard())
  @Role(1)
  showAllUsers(@User() user, @Query('page') page: number) {
    return this.usersService.showAll(page);
  }

  // TODO - admin only
  @Get(':id')
  readUser(@Param('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }
}
