import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { Repository } from 'typeorm';
import { FilteredProductsDto, ProductsDto, ProductsRo } from './products.dto';
import { CategoriesEntity } from '../categories/categories.entity';
import { ProductsFilterBuilder } from './builder/products.filter.builder';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,

    @InjectRepository(CategoriesEntity)
    private categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  private toResponseProduct(product: ProductsEntity): ProductsRo {
    const { created, updated, orderDetails, ...responseObject } = product;
    if (product.category?.name) {
      return { ...responseObject, category: product.category.name };
    }
    return { ...responseObject };
  }

  private toResponseProducts(products: ProductsEntity[]): ProductsRo[] {
    return products.map(product => this.toResponseProduct(product));
  }

  async showAll(page: number = 1) {
    const products = await this.productsRepository.find({
      relations: ['category'],
      take: 9,
      skip: 9 * (page - 1),
    });
    return this.toResponseProducts(products);
  }

  async read(productId: string): Promise<ProductsRo> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });
    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseProduct(product);
  }

  async create(data: ProductsDto): Promise<ProductsRo> {
    const { name, description, unitsOnStock, price, categoryId } = data;
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const productData = { name, description, unitsOnStock, price };
    const product = await this.productsRepository.create({
      ...productData,
      category: category,
    });
    await this.productsRepository.save(product);
    return this.toResponseProduct(product);
  }

  async getFilteredProducts(
    data: Partial<FilteredProductsDto>,
    page: number = 1,
  ) {

    const { minPrice, maxPrice, categoryIdArr, ascending, descending } = data;
    const take = 9;

    const queryBuilder = ProductsFilterBuilder.createProductsQueryBuilder(this.productsRepository, this.categoriesRepository);

    const query = (await queryBuilder.addCategory(categoryIdArr))
      .addMinPrice(minPrice)
      .addMaxPrice(maxPrice)
      .addOrder(ascending, descending)
      .addPagination(page, take)
      .query

    const [products, totalItems] = await query.getManyAndCount();

    if (!products) {
      throw new HttpException('No products found', HttpStatus.NOT_FOUND);
    }

    const totalPages = Math.ceil(totalItems / take);

    return {
      products: this.toResponseProducts(products),
      info: {
        totalPages,
        totalItems,
        pageSize: take,
      },
    };
  }

  async update(productId: string, data: Partial<ProductsDto>) {
    let product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException('Product not found by id', HttpStatus.NOT_FOUND);
    }
    await this.productsRepository.update({ id: productId }, data);
    product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    return this.toResponseProduct(product);
  }

  async delete(productId: string): Promise<ProductsRo>{
    const product = await this.productsRepository.findOne({
      where: {id: productId},
      relations: ['category']
    })

    if(!product){
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    await this.productsRepository.delete({id: productId})
    return this.toResponseProduct(product)

  }

}
