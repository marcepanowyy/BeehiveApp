import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { CategoriesDto } from '../categories/categories.dto';
import { ProductsDto } from './products.dto';

@Controller('products')
export class ProductsController {

  constructor(private productsService: ProductsService) {
  }

  @Get()
  showAllProducts() {
    return this.productsService.showAll();
  }

  @Get(':id')
  readProduct(@Param('id') productId: string) {
    return this.productsService.read(productId)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createProduct(@Body() data: ProductsDto) {
    return this.productsService.create(data)
  }

  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // updateProduct(
  //   @Param('id') productId: string,
  //   @Body() data: Partial<ProductsDto>,
  // ) {
  //   return this.productsService.update(productId, data)
  // }
  //
  // @Delete(':id')
  // deleteCategory(@Param('id') categoryId: string) {
  //   return this.productsService.delete(categoryId)
  // }

}
