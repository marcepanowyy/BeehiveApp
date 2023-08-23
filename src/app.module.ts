import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { HttpErrorFilter } from '../shared/http-error.filter';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { UsersModule } from './auth/users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrderDetailsModule } from './order.details/order.details.module';
import { ProductsReviewModule } from './products.review/products.review.module';
import { RoleGuard } from './auth/guards/role.guard';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { FakeModule } from './fake/fake.module';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { databaseModule } from '../orm.config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    databaseModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrderDetailsModule,
    ProductsReviewModule,
    MailModule,
    FakeModule,
    PassportModule.register({ session: true }),
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
