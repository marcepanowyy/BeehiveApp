import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDto, CategoriesRo } from './categories.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import {
  ApiBody, ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

  constructor(private categoriesService: CategoriesService) {}

  @Get('all')

  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'List of all categories retrieved successfully.', type: [CategoriesRo]})
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  getAllCategories(){
    return this.categoriesService.getAllCategories();
  }

  @Get()

  @ApiOperation({ summary: 'Get categories with pagination' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number })
  @ApiOkResponse({ description: 'Categories retrieved successfully with pagination.', type: [CategoriesRo] })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  getCategories(@Query('page') page: number) {
    return this.categoriesService.getCategories(page);
  }

  @Get(':id')

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiOkResponse({ description: 'Category retrieved successfully.', type: CategoriesRo })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  readCategory(@Param('id') categoryId: string) {
    return this.categoriesService.read(categoryId);
  }

  @Post()
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CategoriesDto })
  @ApiCreatedResponse({ description: 'Category created successfully.', type: CategoriesRo })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  createCategory(@Body() data: CategoriesDto) {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiBody({ type: PartialType(CategoriesDto) })
  @ApiOkResponse({ description: 'Category updated successfully.', type: CategoriesRo })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  updateCategory(
    @Param('id') categoryId: string,
    @Body() data: Partial<CategoriesDto>,
  ) {
    return this.categoriesService.update(categoryId, data);
  }

  @Delete(':id')
  @Role(UserRoleEnum.ADMIN)

  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiOkResponse({ description: 'Category deleted successfully.', type: CategoriesRo })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  deleteCategory(@Param('id') categoryId: string) {
    return this.categoriesService.delete(categoryId);
  }

}
