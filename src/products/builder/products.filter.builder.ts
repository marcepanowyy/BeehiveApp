import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProductsEntity } from '../products.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoriesEntity } from '../../categories/categories.entity';

export class ProductsFilterBuilder {

  private readonly _query: SelectQueryBuilder<ProductsEntity>;

  constructor(
    private productsRepository: Repository<ProductsEntity>,
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {
    this._query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');
  }

  async addCategory(categoryIdArr?: string[]) {

    if (!categoryIdArr || categoryIdArr.length === 0) return this;

    for (const categoryId of categoryIdArr) {
      let category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
    }

    this._query.where('product.categoryId IN (:...categoryIds)', {
      categoryIds: categoryIdArr,
    });
    return this
  }

  addMinPrice(minPrice?: number) {
    if (minPrice) {
      this._query.andWhere('product.price >= :minPrice', { minPrice });
    }
    return this
  }

  addMaxPrice(maxPrice?: number) {
    if (maxPrice) {
      this._query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    return this
  }

  addOrder(ascending?: boolean, descending?: boolean) {
    if (ascending && !descending) {
      this._query.orderBy('product.price', 'ASC');
    } else if (descending && !ascending) {
      this._query.orderBy('product.price', 'DESC');
    }
    return this
  }

  addPagination(page: number, take: number) {
    const skip = take * (page - 1);
    this._query.take(take).skip(skip);
    return this
  }

  get query(): SelectQueryBuilder<ProductsEntity> {
    return this._query;
  }

  public static createProductsQueryBuilder(
    productsRepository: Repository<ProductsEntity>,
    categoriesRepository: Repository<CategoriesEntity>){
    return new ProductsFilterBuilder(productsRepository, categoriesRepository)
  }


}
