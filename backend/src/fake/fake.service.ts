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
import { FakeServiceConfig } from './fake.service.config';

@Injectable()
export class FakeService {
  private testingContainer: ITestingContainer;

  private usedCategoryNames: Set<string> = new Set();
  private usedProductNames: Set<string> = new Set();
  private usedUsernames: Set<string> = new Set();

  private usersInfo = FakeServiceConfig.usersInfo;
  private categoriesInfo = FakeServiceConfig.categoriesInfo;
  private productsInfo = FakeServiceConfig.productsInfo;
  private ordersInfo = FakeServiceConfig.ordersInfo;

  async generate(): Promise<void> {
    this.testingContainer = await createTestingContainer();

    const productsId = [];

    for (let i = 0; i < this.categoriesInfo.number; i++) {
      let categoryName: string;
      do {
        categoryName =
          faker.commerce.productAdjective() + ' ' + faker.commerce.department();
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
        this.categoriesInfo.productsNumber.min,
        this.categoriesInfo.productsNumber.max,
      );

      for (let j = 0; j < randomProductNumber; j++) {
        let productName: string;
        do {
          productName = faker.commerce.productName();
        } while (this.usedProductNames.has(productName));
        this.usedProductNames.add(productName);

        const productData = {
          name: productName,
          description: faker.lorem.sentence({
            min: this.productsInfo.descriptionLength.minWords,
            max: this.productsInfo.descriptionLength.maxWords,
          }),
          unitsOnStock: this.getRandomInteger(
            this.productsInfo.unitsOnStock.min,
            this.productsInfo.unitsOnStock.max,
          ),
          unitPrice: this.getRandomInteger(
            this.productsInfo.unitPrice.min,
            this.productsInfo.unitPrice.max,
          ),
        };
        const product = await createProduct(
          this.testingContainer,
          productData,
          category,
        );
        productsId.push(product.id);
      }
    }

    for (let i = 0; i < this.usersInfo.number; i++) {
      let username: string;
      do {
        username = faker.internet.email();
      } while (this.usedUsernames.has(username));
      this.usedUsernames.add(username);

      const userData = {
        username,
        password: this.generatePassword(),
      };

      const user = await createUser(this.testingContainer, userData, true);

      const randomNumberOfOrders = this.getRandomInteger(
        this.ordersInfo.number.min,
        this.ordersInfo.number.max,
      );

      for (let j = 0; j < randomNumberOfOrders; j++) {
        const orderData = [];

        const randomNumberOfProductsInOrder = this.getRandomInteger(
          this.ordersInfo.productsInOrder.min,
          this.ordersInfo.productsInOrder.max,
        );

        for (let k = 0; k < randomNumberOfProductsInOrder; k++) {
          const randomProductIndex = this.getRandomInteger(
            0,
            productsId.length,
          );
          const selectedProductId = productsId[randomProductIndex];
          const quantity = this.getRandomInteger(
            this.ordersInfo.productsQuantity.min,
            this.ordersInfo.productsQuantity.max,
          );

          orderData.push({
            productId: selectedProductId,
            quantity,
            currency: 'usd',
          });
        }

        const randomStatus = this.getRandomInteger(1, 4);
        await createOrder(this.testingContainer, orderData, user, randomStatus);
      }
    }
  }

  async delete(): Promise<void> {
    this.testingContainer = await createTestingContainer();
    return clearDataBaseData(this.testingContainer);
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generatePassword(): string {
    const specialChars = '!@#$%^&*';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    let password = '';

    while (password.length < 6) {
      password += faker.helpers.fromRegExp('[A-Za-z0-9]');
    }

    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length),
    );
    password += upperCaseChars.charAt(
      Math.floor(Math.random() * upperCaseChars.length),
    );
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));

    return password;
  }
}
