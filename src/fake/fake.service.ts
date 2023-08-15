import { Injectable } from '@nestjs/common';
import {
  createCategory,
  createProduct,
  createUser,
  createOrder,
} from '../../shared/test/helpers';
import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../shared/test/utils';

import { faker } from '@faker-js/faker';

@Injectable()
export class FakeService {

  private testingContainer: ITestingContainer;

  private usedCategoryNames: Set<string> = new Set();
  private usedProductNames: Set<string> = new Set();

  private usersInfo = {
    number: 30
  };

  private categoriesInfo = {
    number: 20
  }

  private productsInfo = {
    // for each category
    number: {
      min: 5,
      max: 30,
    },
    descriptionLength: {
      min: 20,
      max: 50,
    },
    unitsOnStock: {
      min: 0,
      max: 1000,
    },
    price: {
      min: 5,
      max: 999,
    },
  };

  private ordersInfo = {
    number: 1000
  };

  constructor() {
  }

  async generate() {
    this.testingContainer = await createTestingContainer();

    for (let i = 0; i < this.categoriesInfo.number; i++) {
      let categoryName: string;
      do {
        categoryName = faker.commerce.department();
      } while (this.usedCategoryNames.has(categoryName));
      this.usedCategoryNames.add(categoryName);

      const categoryData = {
        name: categoryName,
        description: faker.lorem.sentence(),
      };

      const category = await createCategory(
        this.testingContainer,
        categoryData,
      );

      const randomProductNumber = this.getRandomInteger(
        this.productsInfo.number.min,
        this.productsInfo.number.max,
      );

      for (let j = 0; j < randomProductNumber; j++) {
        let productName: string;
        do {
          productName = faker.commerce.productName();
        } while (this.usedProductNames.has(productName));
        this.usedProductNames.add(productName);

        const productData = {
          name: productName,
          description: faker.lorem.sentence(),
          unitsOnStock: this.getRandomInteger(
            this.productsInfo.unitsOnStock.min,
            this.productsInfo.unitsOnStock.max,
          ),
          price: this.getRandomDecimal(
            this.productsInfo.price.min,
            this.productsInfo.price.max,
            2,
          ),
        };

        const product = createProduct(this.testingContainer, productData, category);
      }
    }
  }

  async delete() {

    this.testingContainer = await createTestingContainer();
    return clearDataBaseData(this.testingContainer);
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomDecimal(min: number, max: number, decimalPlaces: number): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimalPlaces));
  }
}
