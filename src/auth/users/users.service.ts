import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { GoogleUser, PasswordResetDto, UsersDto, UsersRO } from './users.dto';
import { UserTypeEnum } from '../../../shared/enums/user.type.enum';

import { Request, Response } from 'express';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
  ) {}

  // 5 customers, show for each up to 5 orders -> just to check who ordered sth ...
  // it will be deleted later

  async showAll(page: number = 1): Promise<UsersRO[]> {
    const users = await this.usersRepository.find({
      relations: ['orders'],
      take: 5,
      skip: 5 * (page - 1),
    });
    return users.map(user => user.toResponseUser(false, true));
  }

  async getUserById(userId: string, page: number = 1): Promise<UsersRO> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });
    if (!user)
      throw new HttpException("User's id not found", HttpStatus.NOT_FOUND);

    const take = 5;
    const skip = take * (page - 1);
    const paginatedOrders = user.orders.slice(skip, skip + take);

    return {
      ...user.toResponseUser(false),
      orders: paginatedOrders,
    };
  }

  async login(data: UsersDto): Promise<UsersRO> {
    const { username, password } = data;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (
      !user ||
      user.type === UserTypeEnum.GOOGLE ||
      !(await user.comparePassword(password))
    ) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // login only when account is activated
    if (!user.activatedAccount) {
      throw new HttpException(
        'Account is not activated',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.toResponseUser();
  }

  async register(data: UsersDto): Promise<{ message: string }> {
    const { username, password } = data;
    let user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      if (user.type === UserTypeEnum.GOOGLE) {
        user.type = UserTypeEnum.BOTH;
        user.password = password;
        return {
          message:
            'You previously created account with Google. Now it has been merged.',
        };
      } else if (!user.activatedAccount) {
        user.password = password;
      } else {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
    } else {
      user = await this.usersRepository.create(data);
    }

    await this.usersRepository.save(user);

    //send activating mail
    await this.mailService.sendActivatingMail(username);

    return {
      message: 'Account created successfully. Activate your account to log in.',
    };
  }

  async getRoleByUserId(userId: string): Promise<number> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found by ID', HttpStatus.NOT_FOUND);
    }
    return user.role;
  }

  // google

  async googleRedirect(req: Request, res: Response) {
    const userTempId = req.query['state'];
    await this.cacheManager.set(
      `temp-google-user__${userTempId}`,
      req.user,
      10000,
    );
    res.send('<script>window.close()</script>');
  }

  async googleLoginHandler(req: Request) {
    const authorization = req.get('Authorization');
    if (!authorization)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const userTempId = authorization.replace('Bearer ', '');

    if (!userTempId)
      throw new HttpException(
        'No user temporary Id found',
        HttpStatus.UNAUTHORIZED,
      );

    const googleUser: GoogleUser = await this.cacheManager.get(
      `temp-google-user__${userTempId}`,
    );

    return this.googleLogin(googleUser);
  }

  async googleLogin(googleUser: GoogleUser) {
    const { email } = googleUser;
    let user = await this.usersRepository.findOne({
      where: { username: email },
    });
    if (!user) {
      user = this.usersRepository.create({
        username: email,
        type: UserTypeEnum.GOOGLE,
        activatedAccount: true, // when creating google users, automatically activate their accounts
      });
      await this.usersRepository.save(user);
      return user.toResponseUser();
    } else if (user.type === UserTypeEnum.STANDARD) {
      await this.usersRepository.update(user.id, {
        type: UserTypeEnum.BOTH,
        activatedAccount: true, // activate also their account
      });
      const updatedUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      return updatedUser.toResponseUser();
    } else if (
      user.type === UserTypeEnum.BOTH ||
      user.type === UserTypeEnum.GOOGLE
    ) {
      return user.toResponseUser();
    }

    throw new HttpException(
      'Google authentication failed',
      HttpStatus.UNAUTHORIZED,
    );
  }

  // to deserialize user

  async findUserById(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  // end google

  // mailing (verification etc.)

  async activateAccount(verificationKey: string): Promise<string> {
    const userEmail: string = await this.cacheManager.get(
      `temp-user-email-verification-key__${verificationKey}`,
    );

    if (!userEmail)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const user = await this.usersRepository.findOne({
      where: { username: userEmail },
    });

    if (user.activatedAccount) {
      return 'The account has been already activated';
    }

    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.usersRepository.update(user.id, { activatedAccount: true });
    await this.mailService.sendWelcomingMail(userEmail);
    return 'You have activated your account.';
  }

  async handleResetPasswordRequest(
    data: Partial<PasswordResetDto>,
  ): Promise<boolean> {
    const { recipient } = data;

    if (!recipient) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersRepository.findOne({
      where: { username: recipient },
    });

    if (user) {
      await this.mailService.sendPasswordResetMail(recipient);
    }
    // sending 200 whether we have found user or not
    return true;
  }

  async handleResetPasswordCodeConfirmation(
    data: Partial<PasswordResetDto>,
  ): Promise<boolean> {
    const { recipient, code } = data;

    if (!recipient || !code) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const cacheCode = await this.cacheManager.get(
      `temp-user-reset-password-key__${recipient}`,
    );

    if (cacheCode !== code) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersRepository.findOne({
      where: { username: recipient },
    });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }


    return true;
  }

  async changePassword(data: PasswordResetDto): Promise<boolean> {
    const { recipient, code, newPassword } = data;

    if(!recipient || !code || !newPassword){
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const cacheCode = await this.cacheManager.get(
      `temp-user-reset-password-key__${recipient}`,
    );

    if (cacheCode !== code) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersRepository.findOne({
      where: { username: recipient },
    });

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    user.password = newPassword
    await this.usersRepository.save(user)
    return true

  }

  // end mailing
}
