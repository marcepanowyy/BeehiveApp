import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { FilteredProductsDto, ProductsDto } from './products.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  showAllProducts(@Query('page') page: number) {
    return this.productsService.showAll(page);
  }

  @Get(':id')
  readProduct(@Param('id') productId: string) {
    return this.productsService.read(productId);
  }

  // TODO - admin only

  @Post()
  @UsePipes(new ValidationPipe())
  createProduct(@Body() data: ProductsDto) {
    return this.productsService.create(data);
  }

  @Post('filter')
  showFilteredProducts(@Body() data: Partial<FilteredProductsDto>, @Query('page') page: number) {
    return this.productsService.getFilteredProducts(data, page);
  }

  // // TODO - admin only fix me
  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // updateProduct(
  //   @Param('id') productId: string,
  //   @Body() data: Partial<ProductsDto>,
  // ) {
  //   return this.productsService.update(productId, data)
  // }

  // @Delete(':id')
  // deleteCategory(@Param('id') categoryId: string) {
  //   return this.productsService.delete(categoryId)
  // }
}
