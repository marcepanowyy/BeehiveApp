import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UsersRO } from './users.dto';
import { OrdersEntity } from '../../orders/orders.entity';
import { OrdersRo } from '../../orders/orders.dto';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { UserRoleEnum } from '../../../shared/enums/user.role.enum';
import { UserTypeEnum } from '../../../shared/enums/user.type.enum';

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
    nullable: true,
  })
  password: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.CUSTOMER })
  role: UserRoleEnum;

  @Column('enum', { enum: UserTypeEnum, default: UserTypeEnum.STANDARD })
  type: UserTypeEnum;

  @Column({ type: 'boolean', default: false, nullable: false })
  activatedAccount: boolean;

  // relationships

  @OneToMany(type => OrdersEntity, order => order.customer)
  orders: OrdersEntity[];

  @OneToMany(type => ProductsReviewEntity, reviews => reviews.product)
  reviews: ProductsReviewEntity[];

  // end of relationships

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // oauth users have no password unless they register by page
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // private methods here, not in service because of token:

  private toResponseOrder(order: OrdersEntity): OrdersRo {
    const { updated, ...responseOrder } = order;
    return responseOrder;
  }

  // limit - show up to 5 orders for each customer

  private toResponseOrders(
    orders: OrdersEntity[],
    isLimit: boolean = false,
  ): OrdersRo[] {
    const responseOrders = orders.map(order => this.toResponseOrder(order));
    if (isLimit) return responseOrders.slice(0, 5);
    return responseOrders;
  }

  toResponseUser(showToken: boolean = true, isLimit: boolean = false): UsersRO {
    const { id, created, username, token } = this;
    const responseUser: any = { id, created, username };
    if (showToken) responseUser.token = token;
    if (this.orders)
      responseUser.orders = this.toResponseOrders(this.orders, isLimit);
    return responseUser;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  private get token(): string {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY_TIME },
    );
  }
}
