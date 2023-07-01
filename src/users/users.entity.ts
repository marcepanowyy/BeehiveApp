import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersRO } from './users.dto';
import { OrdersEntity } from '../orders/orders.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;

  // relationships

  @OneToMany(type => OrdersEntity, order => order.customer)
  orders: OrdersEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): UsersRO {
    const { id, created, username, token } = this;
    const responseObject: any = { id, created, username };
    if (showToken) responseObject.token = token;
    if (this.orders) responseObject.orders = this.orders
    return responseObject;
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '15min' },
    );
  }
}
