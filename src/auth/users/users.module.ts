import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { GoogleStrategy } from '../strategy/google.strategy';
import { SessionSerializer } from '../serializer/session.serializer';
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, ProductsReviewEntity]), CacheModule.register()],
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy, SessionSerializer],
})
export class UsersModule {}
