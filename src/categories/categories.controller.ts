import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './categories.dto';
import { ValidationPipe } from '../../shared/validation.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  showAllCategories() {
    return this.categoriesService.showAll();
  }

  @Get(':id')
  readCategory(@Param('id') categoryId: string) {
    return this.categoriesService.read(categoryId);
  }

  // TODO - admin only

  @Post()
  @UsePipes(new ValidationPipe())
  createCategory(@Body() data: CategoriesDto) {
    return this.categoriesService.create(data);
  }

  // TODO - admin only

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateCategory(
    @Param('id') categoryId: string,
    @Body() data: Partial<CategoriesDto>,
  ) {
    return this.categoriesService.update(categoryId, data);
  }

  // TODO - admin only

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string) {
    return this.categoriesService.delete(categoryId);
  }
}
