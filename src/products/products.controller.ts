import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { FilteredProductsDto, ProductsDto } from './products.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Role(UserRoleEnum.MEMBER)
  showAllProducts(@Query('page') page: number) {
    return this.productsService.showAll(page);
  }

  @Get(':id')
  @Role(UserRoleEnum.CUSTOMER)
  readProduct(@Param('id') productId: string) {
    return this.productsService.read(productId);
  }


  @Post()
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  createProduct(@Body() data: ProductsDto) {
    return this.productsService.create(data);
  }

  @Post('filter')
  showFilteredProducts(@Body() data: Partial<FilteredProductsDto>, @Query('page') page: number) {
    return this.productsService.getFilteredProducts(data, page);
  }

}
