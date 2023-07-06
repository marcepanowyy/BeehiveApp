import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseModule } from '../orm.config';
import { OrdersModule } from './orders/orders.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from '../shared/http-error.filter';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrderDetailsModule } from './order.details/order.details.module';
import { RoleGuard } from '../shared/guards/role.guard';
import { ProductsReviewModule } from './products.review/products.review.module';

@Module({
  imports: [
    databaseModule,
    OrdersModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrderDetailsModule,
    ProductsReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_GUARD,
      useClass: RoleGuard
    },
  ],
})
export class AppModule {}
