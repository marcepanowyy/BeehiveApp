import {
  Body,
  Controller,
  Get, Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import { AuthGuard } from '../../shared/auth.guard';
import { User } from './users.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiNotFoundResponse, ApiParam, ApiProperty, ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  // @UseGuards(new AuthGuard())
  // showAllUsers(@User() user) {
  // TODO - admin only
  @ApiCreatedResponse({ description: 'Created users object as response.'})
  showAllUsers() {
    return this.usersService.showAll();
  }

  // TODO - admin only
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'User id',
    example: 'b29ff321-e113-44b4-b776-92c044ad2157'
  })
  @ApiNotFoundResponse({description: 'User\'s id not found'})
  @ApiCreatedResponse({ description: 'Created user object as response.'})
  readUser(@Param('id') userId: string){
    return this.usersService.read(userId)
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Created user object as response.'})
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.'})
  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Created user object as response.' })
  @ApiUnauthorizedResponse({ description: 'User already exists.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }
}
