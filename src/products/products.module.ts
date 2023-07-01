import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { ProductsEntity } from './products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEntity, ProductsEntity])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
