import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordResetDto, UsersDto } from './users.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from '../../../shared/decorators/roles.decorator';
import { ValidationPipe } from '../../../shared/validation.pipe';
import { GoogleAuthGuard } from '../guards/google.auth.guard';
import { UserRoleEnum } from '../../../shared/enums/user.role.enum';

@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.ADMIN)
  @ApiCreatedResponse({ description: 'Created users object as response.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  showAllUsers(@Query('page') page: number) {
    return this.usersService.showAll(page);
  }

  @Get('users/:id')
  @Role(UserRoleEnum.ADMIN)
  @ApiParam({
    name: 'id',
    description: 'User id',
    example: 'b29ff321-e113-44b4-b776-92c044ad2157',
  })
  @ApiNotFoundResponse({ description: "User's id not found" })
  @ApiCreatedResponse({ description: 'Created user object as response.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  readUser(@Param('id') userId: string, @Query('page') page: number) {
    return this.usersService.getUserById(userId, page);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Created user object as response.' })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Created user object as response.' })
  @ApiUnauthorizedResponse({ description: 'User already exists.' })
  @ApiBadRequestResponse({ description: 'Cannot create the user. Try again.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }

  // google oauth 2.0

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleRedirect(@Req() req, @Res() res) {
    return this.usersService.googleRedirect(req, res);
  }

  @Post('google/login')
  googleLogin(@Req() req) {
    return this.usersService.googleLoginHandler(req);
  }

  // end google oauth 2.0

  // sending mails

  @Get('activate/:verificationKey')
  activateAccount(@Param('verificationKey') verificationKey: string) {
    return this.usersService.activateAccount(verificationKey);
  }

  @Post('reset')
  sendResetCode(@Body() data: Partial<PasswordResetDto>) {
    return this.usersService.handleResetPasswordRequest(data);
  }

  @Post('password/code/confirmation')
  confirmCode(@Body() data: Partial<PasswordResetDto>) {
    return this.usersService.handleResetPasswordCodeConfirmation(data);
  }

  @Post('password/change')
  changePassword(@Body() data: PasswordResetDto) {
    return this.usersService.changePassword(data);
  }

  // end sending mails

}
