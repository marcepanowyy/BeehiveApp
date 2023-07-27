import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { GoogleStrategy } from '../strategy/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, ProductsReviewEntity])],
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy],
})
export class UsersModule {}
