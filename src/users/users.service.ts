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

  async showAll(page: number = 1): Promise<UsersRO[]> {
    const users = await this.usersRepository.find({
      relations: ['orders'],
      take: 5,
      skip: 5 * (page - 1),
    });
    return users.map(user => user.toResponseUser(false));
  }

  async getUserById(userId: string): Promise<UsersRO> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });
    if (!user)
      throw new HttpException("User's id not found", HttpStatus.NOT_FOUND);
    return user.toResponseUser();
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

  async findById(userId: string) {
    const user = this.usersRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new HttpException("Invalid user's id", HttpStatus.NOT_FOUND);
    return user;
  }
}
