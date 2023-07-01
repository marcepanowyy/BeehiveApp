import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';
import { ValidationPipe } from '../../shared/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  showAllUsers() {
    return this.usersService.showAll()
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UsersDto) {
    return this.usersService.login(data)
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UsersDto) {
    return this.usersService.register(data)
  }
}
