import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { Repository } from 'typeorm';
import { CategoriesDto, CategoriesRo } from './categories.dto';
import { ProductsEntity } from '../products/products.entity';
import { ProductsRo } from '../products/products.dto';
// import { ProductsService} from '../products/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
    // private productsService: ProductsService
  ) {}

  private toResponseObject(category: CategoriesEntity): CategoriesRo {
    const {created, updated, ...responseObject} = category
    if(!responseObject.products) return {...responseObject}
    const products = responseObject.products
    return {...responseObject, products: products.map(product => this.toResponseProduct(product))}
  }

  private toResponseProduct(product: ProductsEntity): ProductsRo{
    const {created, updated, ...responseObject} = product
    return {...responseObject}
  }

  async showAll(): Promise<CategoriesRo[]> {
    const categories = await this.categoriesRepository.find({relations: ['products']});
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
    console.log(data)
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

  // TODO: fix
  async delete(categoryId: string): Promise<CategoriesRo> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.categoriesRepository.delete({id: categoryId});
    return this.toResponseObject(category);
  }
}
