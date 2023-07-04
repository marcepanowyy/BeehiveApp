import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { Repository } from 'typeorm';
import { ProductsDto, ProductsRo } from './products.dto';
import { CategoriesEntity } from '../categories/categories.entity';

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
    return { ...responseObject, category: product.category.name };
  }

  private toResponseProducts(products: ProductsEntity[]): ProductsRo[] {
    return products.map(product => this.toResponseProduct(product));
  }

  async showAll() {
    const products = await this.productsRepository.find({
      relations: ['category'],
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
    const { name, description, unitsOnStock, price, categoryName } = data;
    const category = await this.categoriesRepository.findOne({
      where: { name: categoryName },
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
}
