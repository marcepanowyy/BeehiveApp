import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UsersDto, UsersRO } from './users.dto';

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

}
