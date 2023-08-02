import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { GoogleUserDetails, UsersDto, UsersRO } from './users.dto';
import { UserTypeEnum } from '../../../shared/enums/user.type.enum';
import { buildSwaggerInitJS } from '@nestjs/swagger/dist/swagger-ui';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
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
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.toResponseUser();
  }

  async register(data: UsersDto): Promise<UsersRO> {
    const { username } = data;
    let user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return user.toResponseUser();
  }

  // todo - when registering normal user - check for google user
  // todo - if google user's email exists - change password from
  // todo - null to value

  // todo - add tests

  async validateGoogleUser(details: GoogleUserDetails) {
    const { email, displayName } = details;
    let user = await this.usersRepository.findOne({
      where: { username: email },
    });
    if (!user) {
      user = this.usersRepository.create({
        type: UserTypeEnum.GOOGLE,
        username: email,
      });
      await this.usersRepository.save(user);
      return user.toResponseUser();
    } else if (user.type === UserTypeEnum.STANDARD) {
      await this.usersRepository.update(user.id, { type: UserTypeEnum.BOTH });
      const updatedUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      return updatedUser.toResponseUser();
    }

    // throw new HttpException("Google authentication failed", HttpStatus.UNAUTHORIZED)

  }
}
