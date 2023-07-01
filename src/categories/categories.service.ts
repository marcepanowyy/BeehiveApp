import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';
import { CategoriesDto, CategoriesRo } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  private toResponseObject(category: CategoriesEntity): CategoriesRo {
    const responseObject: any = {
      ...category,
      // products: category.products.toResponseObject()
    };
    return responseObject;
  }

  async showAll(): Promise<CategoriesRo[]> {
    const categories = await this.categoriesRepository.find();
    return categories.map(category => this.toResponseObject(category));
  }

  async read(categoryId: string): Promise<CategoriesRo> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(category);
  }

  async create(data: CategoriesDto): Promise<CategoriesRo> {
    const category = this.categoriesRepository.create({ ...data });
    await this.categoriesRepository.save(category);
    return this.toResponseObject(category);
  }

  async update(
    categoryId: string,
    data: Partial<CategoriesDto>,
  ): Promise<CategoriesRo> {
    let category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.categoriesRepository.update({ id: categoryId }, data);
    category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    return this.toResponseObject(category);
  }

  async delete(categoryId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.categoriesRepository.delete({ id: categoryId });
    return this.toResponseObject(category);
  }
}
