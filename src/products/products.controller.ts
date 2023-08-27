import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { FilteredProductsDto, ProductsDto, ProductsRo } from './products.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Role(UserRoleEnum.MEMBER)

  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiOkResponse({ description: 'Products retrieved successfully.', type: [ProductsRo] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showAllProducts(@Query('page') page: number) {
    return this.productsService.showAll(page);
  }

  @Get(':id')
  @Role(UserRoleEnum.CUSTOMER)

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiOkResponse({ description: 'Product retrieved successfully.', type: ProductsRo })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  readProduct(@Param('id') productId: string) {
    return this.productsService.read(productId);
  }


  @Post()
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: ProductsDto })
  @ApiCreatedResponse({ description: 'Product created successfully.', type: ProductsRo })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  createProduct(@Body() data: ProductsDto) {
    return this.productsService.create(data);
  }

  @Post('filter')

  @ApiOperation({ summary: 'Get filtered products' })
  @ApiBody({ type: FilteredProductsDto })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiOkResponse({ description: 'Filtered products retrieved successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'No products found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showFilteredProducts(@Body() data: Partial<FilteredProductsDto>, @Query('page') page: number) {
    return this.productsService.getFilteredProducts(data, page);
  }

}
