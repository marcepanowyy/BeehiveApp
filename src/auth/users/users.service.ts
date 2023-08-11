import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { GoogleUser, UsersDto, UsersRO } from './users.dto';
import { UserTypeEnum } from '../../../shared/enums/user.type.enum';

import { Request, Response } from 'express';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from '../../mail/mail.service';
import * as jwt from 'jsonwebtoken';


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
    return user.toResponseUser();
  }

  async register(data: UsersDto): Promise<UsersRO> {
    const { username, password } = data;
    let user = await this.usersRepository.findOne({ where: { username } });
    if (user && user.type === UserTypeEnum.GOOGLE) {
      user.type = UserTypeEnum.BOTH;
      user.password = password;
    } else if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    } else {
      user = await this.usersRepository.create(data);
    }
    await this.usersRepository.save(user);

    // send welcoming mail
    this.mailService.sendWelcomingMail(username)
    //send activating mail
    this.mailService.sendActivatingMail(username)

    return user.toResponseUser();
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

      // send welcoming email
      this.mailService.sendWelcomingMail(email)

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

  // mails (verification etc.)

  async activateAccount(verificationKey: string): Promise<string> {

    const decoded: any = jwt.verify(verificationKey, process.env.EMAIL_ACTIVATION_SECRET)

    if (!decoded) {
      throw new HttpException('Token is invalid or expired', HttpStatus.UNAUTHORIZED);
    }

    const userEmail = decoded.recipient

    if (!userEmail){
      throw new HttpException('Invalid address email', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersRepository.findOne({where: {username: userEmail}})

    if (!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.update(user.id, {activatedAccount: true})

    return "you have activated your account"

  }

  async resetPassword(){

  }

}
