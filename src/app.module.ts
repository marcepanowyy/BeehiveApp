import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseModule } from '../orm.config';
import { OrdersModule } from './orders/orders.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from '../shared/http-error.filter';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [databaseModule, OrdersModule, UsersModule],
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
  ],
})
export class AppModule {}
