import {
  Body,
  Controller,
  Get,
  Param,
  Post, Query, Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from '../../../shared/decorators/roles.decorator';
import { ValidationPipe } from '../../../shared/validation.pipe';
import { GoogleAuthGuard } from '../guards/google.auth.guard';



@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // TODO - admin only
  @Get()
  @UseGuards(new AuthGuard())
  @Role(1)

  @ApiCreatedResponse({ description: 'Created users object as response.'})
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error.'})

  showAllUsers(@Query('page') page: number) {
    return this.usersService.showAll(page);
  }

  // TODO - admin only
  @Get('users/:id')

  @ApiParam({
    name: 'id',
    description: 'User id',
    example: 'b29ff321-e113-44b4-b776-92c044ad2157'
  })
  @ApiNotFoundResponse({description: 'User\'s id not found'})
  @ApiCreatedResponse({ description: 'Created user object as response.'})
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error.'})

  readUser(@Param('id') userId: string, @Query('page') page: number) {
    return this.usersService.getUserById(userId, page);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())

  @ApiCreatedResponse({ description: 'Created user object as response.'})
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.'})
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error.'})

  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())

  @ApiCreatedResponse({ description: 'Created user object as response.' })
  @ApiUnauthorizedResponse({ description: 'User already exists.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error.'})

  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }


  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin(){
    console.log('handle login')
    // return {msg: 'Google Authentication'}
    // findOrCreateGoogleUser()
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(){
    // return {msg: 'OK'}
    console.log('handle redirect')
  }


}
