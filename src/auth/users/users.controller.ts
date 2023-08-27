import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordResetDto, UsersDto } from './users.dto';
import {
  ApiBadRequestResponse, ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiOperation,
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

  @ApiOperation({ summary: 'Get list of all users' })
  @ApiOkResponse({ description: 'List of users retrieved successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showAllUsers(@Query('page') page: number) {
    return this.usersService.showAll(page);
  }

  @Get('users/:id')
  @Role(UserRoleEnum.ADMIN)

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User id',
    example: 'b29ff321-e113-44b4-b776-92c044ad2157',
  })
  @ApiOkResponse({ description: 'User retrieved successfully.' })
  @ApiNotFoundResponse({ description: "User's ID not found." })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  readUser(@Param('id') userId: string, @Query('page') page: number) {
    return this.usersService.getUserById(userId, page);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UsersDto })
  @ApiOkResponse({ description: 'Logged in successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid credentials.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  login(@Body() data: UsersDto) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: UsersDto })
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request or user already exists.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  register(@Body() data: UsersDto) {
    return this.usersService.register(data);
  }

  // google oauth 2.0

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)

  @ApiOperation({ summary: 'Handle Google redirect after OAuth login' })
  @ApiOkResponse({ description: 'Google redirect handled successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  handleGoogleRedirect(@Req() req, @Res() res) {
    return this.usersService.googleRedirect(req, res);
  }

  @Post('google/login')

  @ApiOperation({ summary: 'Login using Google account' })
  @ApiOkResponse({ description: 'Logged in using Google account.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid token.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  googleLogin(@Req() req) {
    return this.usersService.googleLoginHandler(req);
  }

  // end google oauth 2.0

  // sending mails

  @Get('activate/:verificationKey')

  @ApiOperation({ summary: 'Activate user account using verification key' })
  @ApiOkResponse({ description: 'Account activated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or verification key not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  activateAccount(@Param('verificationKey') verificationKey: string) {
    return this.usersService.activateAccount(verificationKey);
  }

  @Post('reset')

  @ApiOperation({ summary: 'Send password reset code to user email' })
  @ApiBody({ type: PasswordResetDto })
  @ApiOkResponse({ description: 'Password reset code sent successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request or account not activated.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  sendResetCode(@Body() data: Partial<PasswordResetDto>) {
    return this.usersService.handleResetPasswordRequest(data);
  }

  @Post('password/code/confirmation')

  @ApiOperation({ summary: 'Confirm password reset code' })
  @ApiBody({ type: PasswordResetDto })
  @ApiOkResponse({ description: 'Password reset code confirmed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or code mismatch.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  confirmCode(@Body() data: Partial<PasswordResetDto>) {
    return this.usersService.handleResetPasswordCodeConfirmation(data);
  }

  @Post('password/change')

  @ApiOperation({ summary: 'Change user password after confirming reset code' })
  @ApiBody({ type: PasswordResetDto })
  @ApiOkResponse({ description: 'Password changed successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or code mismatch.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  changePassword(@Body() data: PasswordResetDto) {
    return this.usersService.changePassword(data);
  }

  // end sending mails

}
