import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { ProductsReviewEntity } from '../../products.review/products.review.entity';
import { GoogleStrategy } from '../strategy/google.strategy';
import { SessionSerializer } from '../serializer/session.serializer';
import { MailingModule } from '../../mailing/mailing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, ProductsReviewEntity]),
    MailingModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy, SessionSerializer],
  exports: [UsersService]
})
export class UsersModule {}
