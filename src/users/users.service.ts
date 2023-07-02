import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UsersDto, UsersRO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  async showAll(): Promise<UsersRO[]> {
    const users = await this.userRepository.find({relations: ['orders']});
    return users.map(user => user.toResponseUser(false));
  }

  async login(data: UsersDto): Promise<UsersRO>{
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseUser()
  }

  async register(data: UsersDto): Promise<UsersRO>{
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user ) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(data)
    await this.userRepository.save(user)
    return user.toResponseUser()
  }

}
