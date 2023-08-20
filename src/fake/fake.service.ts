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
import { FakeServiceConfig } from '../../config/fake.service.config';

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

  async generate() {
    this.testingContainer = await createTestingContainer();

    const productsId = []

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
              max: this.productsInfo.descriptionLength.maxWords
          }),
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
        const product = await createProduct(
          this.testingContainer,
          productData,
          category,
        );

        productsId.push(product.id)

      }
    }

    let flag = false

    for (let i = 0; i < this.usersInfo.number; i++) {
      let username: string;
      do {
        username = faker.internet.email();
      } while (this.usedUsernames.has(username));
      this.usedUsernames.add(username);

      const userData = {
        username,
        password: this.generatePassword()
      };

      const user = await createUser(this.testingContainer, userData, true);

      const randomNumberOfOrders = this.getRandomInteger(
        this.ordersInfo.number.min,
        this.ordersInfo.number.max
      );

      for(let j = 0; j < randomNumberOfOrders; j++){
        const orderProducts = [];

        const randomNumberOfProductsInOrder = this.getRandomInteger(this.ordersInfo.productsInOrder.min,
          this.ordersInfo.productsInOrder.max)

        for(let k = 0; k < randomNumberOfProductsInOrder; k++){

          const randomProductIndex = this.getRandomInteger(0, productsId.length)
          const selectedProductId = productsId[randomProductIndex]
          const quantity = this.getRandomInteger(this.ordersInfo.productsQuantity.min, this.ordersInfo.productsQuantity.max)

          orderProducts.push({
            productId: selectedProductId,
            quantity
          })

        }
        const orderData = {
          productsArray: orderProducts
        }

        const randomStatus = this.getRandomInteger(1, 4)

        await createOrder(this.testingContainer, orderData, user, randomStatus)

      }

      if(!flag){
        console.log(userData)
      }
      flag = true

    }

  }

  async delete(): Promise<void> {
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

  generatePassword(): string {
    const specialChars = '!@#$%^&*';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    let password = '';

    while (password.length < 6) {
      password += faker.helpers.fromRegExp('[A-Za-z0-9]');
    }

    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));

    return password;
  }

}
