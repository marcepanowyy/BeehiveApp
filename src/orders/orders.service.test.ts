import { before, beforeEach, describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../shared/test/utils';
import { In } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StatusEnum } from '../../shared/enums/status.enum';

describe('OrdersService', () => {
  let testingContainer: ITestingContainer;

  let categoryData1, categoryData2;
  let category1, category2;
  let productData1, productData2, productData3, productData4;
  let product1, product2, product3, product4;
  let userData1, user1;
  let orderData1, orderData2, orderData3, orderData4;
  let order1;
  let orderDetails1

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {
    await clearDataBaseData(testingContainer);

    categoryData1 = {
      name: 'testCategoryName1',
      description: 'testCategoryDescription1',
    };

    categoryData2 = {
      name: 'testCategoryName2',
      description: 'testCategoryDescription2',
    };

    category1 =
      testingContainer.repositories.categoriesRepository.create(categoryData1);
    await testingContainer.repositories.categoriesRepository.save(category1);

    category2 =
      testingContainer.repositories.categoriesRepository.create(categoryData2);
    await testingContainer.repositories.categoriesRepository.save(category2);

    productData1 = {
      name: 'testProductName1',
      description: 'testProductDescription1',
      unitsOnStock: 2,
      price: 21.37,
      category: category1,
    };

    productData2 = {
      name: 'testProductName2',
      description: 'testProductDescription2',
      unitsOnStock: 23,
      price: 1,
      category: category1,
    };

    productData3 = {
      name: 'testProductName3',
      description: 'testProductDescription3',
      unitsOnStock: 0,
      price: 999,
      category: category2,
    };

    productData4 = {
      name: 'testProductName4',
      description: 'testProductDescription4',
      unitsOnStock: 999,
      price: 999,
      category: category2,
    };

    product1 =
      testingContainer.repositories.productsRepository.create(productData1);
    await testingContainer.repositories.productsRepository.save(product1);

    product2 =
      testingContainer.repositories.productsRepository.create(productData2);
    await testingContainer.repositories.productsRepository.save(product2);

    product3 =
      testingContainer.repositories.productsRepository.create(productData3);
    await testingContainer.repositories.productsRepository.save(product3);

    product4 =
      testingContainer.repositories.productsRepository.create(productData4);
    await testingContainer.repositories.productsRepository.save(product4);

    userData1 = {
      username: 'test@user.com',
      password: 'tE$Tp4sSw0rd123',
    };

    user1 = testingContainer.repositories.usersRepository.create(userData1);
    await testingContainer.repositories.usersRepository.save(user1);

    orderData1 = {
      productsArray: [
        {
          productId: product1.id,
          quantity: 1,
        },
        {
          productId: product2.id,
          quantity: 3,
        },
      ],
    };

    orderData2 = {
      productsArray: [
        {
          productId: product1.id,
          quantity: 1,
        },
        {
          productId: product2.id,
          quantity: 1,
        },
        {
          productId: product3.id,
          quantity: 1,
        },
      ],
    };

    orderData3 = {
      productsArray: [
        {
          productId: product1.id,
          quantity: 1,
        },
      ],
    };

    orderData4 = {
      productsArray: [
        {
          productId: product4.id,
          quantity: 1,
        },
      ],
    };

    order1 = await testingContainer.repositories.ordersRepository.create({
      customer: user1,
    });

    await testingContainer.repositories.ordersRepository.save(order1);

    await testingContainer.repositories.productsRepository.update(product4.id, {
      unitsOnStock: product4.unitsOnStock - 1,
    });

    orderDetails1 = await testingContainer.repositories.orderDetailsRepository.create({
      product: product4,
      order: order1,
      quantity: 1,
    });

    await testingContainer.repositories.orderDetailsRepository.save(orderDetails1)

  });

  it('should create an order with valid data', async () => {
    const result = await testingContainer.services.ordersService.create(
      orderData1,
      user1.id,
    );

    const updatedProduct1 =
      await testingContainer.repositories.productsRepository.findOne({
        where: { id: product1.id },
      });
    const updatedProduct2 =
      await testingContainer.repositories.productsRepository.findOne({
        where: { id: product2.id },
      });

    assert.strictEqual(result.status, 'processing');

    assert.strictEqual(result.customer.id, user1.id);

    const products1 = result.products;

    assert.strictEqual(products1[0].productId, product1.id);
    assert.strictEqual(products1[0].quantity, 1);
    assert.strictEqual(updatedProduct1.unitsOnStock, 1); // 2 - 1 = 1

    assert.strictEqual(products1[1].productId, product2.id);
    assert.strictEqual(products1[1].quantity, 3);
    assert.strictEqual(updatedProduct2.unitsOnStock, 20); // 23 - 3 = 20

    // check whether rows added in Order Details table
    const [_, productCount1] =
      await testingContainer.repositories.orderDetailsRepository.findAndCount({
        where: {
          order: { id: result.id },
          product: { id: In([products1[0].productId, products1[1].productId]) },
        },
      });

    assert.strictEqual(productCount1, 2);
  });

  it('should throw an error when creating order, if product has insufficient units on stock', async () => {
    await assert.rejects(
      async () => {
        await testingContainer.services.ordersService.create(
          orderData2,
          user1.id,
        );
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(
          err.response,
          'Insufficient stock for product: testProductName3',
        );
        assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
        return true;
      },
    );
  });

  it('should validate status with valid data', async () => {
    const validStatus1 = StatusEnum.PROCESSING;
    const validStatus2 = StatusEnum.SHIPPED;
    const validStatus3 = StatusEnum.DELIVERED;
    const validStatus4 = StatusEnum.CANCELLED;

    const result1 =
      testingContainer.services.ordersService.validateStatus(validStatus1);
    const result2 =
      testingContainer.services.ordersService.validateStatus(validStatus2);
    const result3 =
      testingContainer.services.ordersService.validateStatus(validStatus3);
    const result4 =
      testingContainer.services.ordersService.validateStatus(validStatus4);

    assert.strictEqual(result1, true);
    assert.strictEqual(result2, true);
    assert.strictEqual(result3, true);
    assert.strictEqual(result4, true);
  });

  it('should throw an error when validating status with invalid data', async () => {
    const invalidStatus1 = 'invalidStatus';
    const invalidStatus2 = '';

    await assert.rejects(
      async () => {
        testingContainer.services.ordersService.validateStatus(invalidStatus1);
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Invalid status');
        assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
        return true;
      },
    );

    await assert.rejects(
      async () => {
        testingContainer.services.ordersService.validateStatus(invalidStatus2);
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Invalid status');
        assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
        return true;
      },
    );
  });

  // it('should get order by its id, if invalid id - throw an error'); //???
  // it('should get order by the user id, if invalid id - throw an error');

  it('should update an order with valid data', async () => {

    const orderStatusData = {
      customerId: user1.id,
      status: StatusEnum.SHIPPED,
    };

    await testingContainer.services.ordersService.updateStatusById(
      order1.id,
      orderStatusData,
    );

    const updatedOrder = await testingContainer.repositories.ordersRepository.findOne(
      { where: { id: order1.id } },
    );

    assert.strictEqual(updatedOrder.id, order1.id);
    assert.strictEqual(updatedOrder.status, 'shipped');

  });

  // it(
  //   'should throw en error when updating order with invalid order status data', order id / userid ??
  // );

  it('should delete an order by valid order id', async () => {

    await testingContainer.services.ordersService.destroy(order1.id, user1.id)

    const orderDetails = await testingContainer.repositories.orderDetailsRepository.findOne({where: {order: {id: order1.id}}})
    const order = await testingContainer.repositories.ordersRepository.findOne({where: {id: order1.id}})

    assert.strictEqual(orderDetails, null)
    assert.strictEqual(order, null)

  });
});
