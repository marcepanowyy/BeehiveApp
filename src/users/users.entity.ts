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
import { OrdersRo } from '../orders/orders.dto';

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

  @Column({ type: 'integer', default: 1 }) role: number;

  // relationships

  @OneToMany(type => OrdersEntity, order => order.customer)
  orders: OrdersEntity[];

  // end of relationships

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // private methods here, not in service because of token:

  private toResponseOrder(order: OrdersEntity): OrdersRo {
    const { updated, ...responseOrder } = order;
    return responseOrder;
  }

  private toResponseOrders(orders: OrdersEntity[]): OrdersRo[] {
    return orders.map(order => this.toResponseOrder(order));
  }

  toResponseUser(showToken: boolean = true): UsersRO {
    const { id, created, username, token } = this;
    const responseUser: any = { id, created, username };
    if (showToken) responseUser.token = token;
    if (this.orders) responseUser.orders = this.toResponseOrders(this.orders);
    return responseUser;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  private get token(): string {
    const { id, username, role } = this;
    return jwt.sign(
      {
        id,
        username,
        // TODO - dont save role to jwt payload, instead, use id to get
        //  user from db and check for role in decorator
        role
      },
      process.env.SECRET,
      { expiresIn: '30days' },
    );
  }
}
