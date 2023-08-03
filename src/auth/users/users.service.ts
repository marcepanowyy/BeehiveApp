import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { GoogleUserDetails, UsersDto, UsersRO } from './users.dto';
import { UserTypeEnum } from '../../../shared/enums/user.type.enum';

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
    return user.toResponseUser();
  }

  async validateGoogleUser(details: GoogleUserDetails) {
    const { email } = details;
    let user = await this.usersRepository.findOne({
      where: { username: email },
    });
    if (!user) {
      user = this.usersRepository.create({
        username: email,
        type: UserTypeEnum.GOOGLE,
      });
      await this.usersRepository.save(user);
      return user.toResponseUser();
    } else if (user.type === UserTypeEnum.STANDARD) {
      await this.usersRepository.update(user.id, { type: UserTypeEnum.BOTH });
      const updatedUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      return updatedUser.toResponseUser();
    } else if (user.type === UserTypeEnum.BOTH || user.type === UserTypeEnum.GOOGLE) {
      return user.toResponseUser();
    }

    throw new HttpException(
      'Google authentication failed',
      HttpStatus.UNAUTHORIZED,
    );
  }

  // to deserialize user
  async findUserById(id: string) {
    return  await this.usersRepository.findOneBy({ id });
  }
}
