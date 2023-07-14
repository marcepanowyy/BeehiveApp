import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';
import { CategoriesDto, CategoriesRo } from './categories.dto';
import { ProductsEntity } from '../products/products.entity';
import { ProductsRo } from '../products/products.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  private toResponseCategory(category: CategoriesEntity): CategoriesRo {
    const { created, updated, ...responseObject } = category;
    if (!responseObject.products) return { ...responseObject };
    const products = responseObject.products;
    return {
      ...responseObject,
      products: products.map(product => this.toResponseProduct(product)),
    };
  }

  private toResponseCategories(categories: CategoriesEntity[]): CategoriesRo[] {
    return categories.map(category => this.toResponseCategory(category));
  }

  private toResponseProduct(product: ProductsEntity): ProductsRo {
    const { created, updated, ...responseObject } = product;
    return responseObject;
  }

  async showAll(page: number = 1): Promise<CategoriesRo[]> {
    const take = 10;
    const [categories, totalCategories] =
      await this.categoriesRepository.findAndCount({
        take,
        skip: take * (page - 1),
      });

    const totalPages = Math.ceil(totalCategories / take);

    const responseObject: any = {
      categories: this.toResponseCategories(categories),
      totalPages,
      totalCategories,
      pageSize: take,
    };

    return {...responseObject};
  }

  async read(categoryId: string): Promise<CategoriesRo> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseCategory(category);
  }

  async create(data: CategoriesDto): Promise<CategoriesRo> {
    const category = this.categoriesRepository.create({ ...data });
    await this.categoriesRepository.save(category);
    return this.toResponseCategory(category);
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
    return this.toResponseCategory(category);
  }

  // TODO: fix - cascade deleting
  async delete(categoryId: string): Promise<CategoriesRo> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.categoriesRepository.delete({ id: categoryId });
    return this.toResponseCategory(category);
  }
}
