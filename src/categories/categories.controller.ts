import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './categories.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}


  @Get('all')
  getAllCategories(){
    return this.categoriesService.getAllCategories();
  }

  @Get()
  getCategories(@Query('page') page: number) {
    return this.categoriesService.getCategories(page);
  }

  @Get(':id')
  readCategory(@Param('id') categoryId: string) {
    return this.categoriesService.read(categoryId);
  }

  @Post()
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  createCategory(@Body() data: CategoriesDto) {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  @Role(UserRoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  updateCategory(
    @Param('id') categoryId: string,
    @Body() data: Partial<CategoriesDto>,
  ) {
    return this.categoriesService.update(categoryId, data);
  }

  @Delete(':id')
  @Role(UserRoleEnum.ADMIN)
  deleteCategory(@Param('id') categoryId: string) {
    return this.categoriesService.delete(categoryId);
  }
}
