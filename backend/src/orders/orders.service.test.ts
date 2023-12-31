import { strict as assert } from 'node:assert';

import { clearDataBaseData, createTestingContainer, ITestingContainer } from '../../shared/test/utils';
import { In } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { sampleCategoryData, sampleProductData, sampleUserData } from '../../shared/test/samples';
import { createCategory, createOrder, createProduct, createUser } from '../../shared/test/helpers';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';
import { DeliveryStatusEnum } from '../../shared/enums/delivery.status.enum';

describe('OrdersService', () => {
  let testingContainer: ITestingContainer;

  const categoryData1 = sampleCategoryData.categoryData1;
  const categoryData2 = sampleCategoryData.categoryData2;

  const productData1 = sampleProductData.productData1;
  const productData2 = sampleProductData.productData2;
  const productData3 = sampleProductData.productData3;
  const productData4 = sampleProductData.productData4;

  const userData1 = sampleUserData.userData1;

  let category1, category2;
  let product1, product2, product3, product4;
  let user1;
  let orderData1, orderData2, orderData3, orderData4


  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {

    await clearDataBaseData(testingContainer);

    category1 = await createCategory(testingContainer, categoryData1);
    category2 = await createCategory(testingContainer, categoryData2);

    user1 = await createUser(testingContainer, userData1);

    // to control quantity of products
    product1 = await createProduct(testingContainer, productData1, category1);
    product2 = await createProduct(testingContainer, productData2, category1);
    product3 = await createProduct(testingContainer, productData3, category2);
    product4 = await createProduct(testingContainer, productData4, category2);

    orderData1 = [
      {
        productId: product1.id,
        quantity: 1,
        currency: 'usd'
      },
      {
        productId: product2.id,
        quantity: 3,
        currency: 'usd'
      },
    ]

    orderData2 = [
      {
        productId: product1.id,
        quantity: 1,
        currency: 'usd'
      },
      {
        productId: product2.id,
        quantity: 1,
        currency: 'usd'
      },
      {
        productId: product3.id,
        quantity: 1,
        currency: 'usd'
      },
    ];
    orderData3 = [
      {
        productId: product1.id,
        quantity: 1,
        currency: 'usd'
      },
    ]
    orderData4 = [
      {
        productId: product4.id,
        quantity: 1,
        currency: 'usd'
      },
    ]
  });

  it('should create an order with valid data', async () => {

    const result = await testingContainer.services.ordersService.createOrder(
      user1.id,
      orderData1,
      PaymentStatusEnum.AWAITING
    );

    // when we order, product's quantity decreases

    const updatedProduct1 =
      await testingContainer.repositories.productsRepository.findOne({
        where: { id: product1.id },
      });
    const updatedProduct2 =
      await testingContainer.repositories.productsRepository.findOne({
        where: { id: product2.id },
      });

    assert.strictEqual(result.deliveryStatus, 'PROCESSING');
    assert.strictEqual(result.paymentStatus, 'AWAITING');
    assert.strictEqual(result.customer.id, user1.id);

    const products = result.products;

    assert.strictEqual(products[0].productId, product1.id);
    assert.strictEqual(products[0].quantity, 1);
    assert.strictEqual(updatedProduct1.unitsOnStock, 1); // 2 - 1 = 1

    assert.strictEqual(products[1].productId, product2.id);
    assert.strictEqual(products[1].quantity, 3);
    assert.strictEqual(updatedProduct2.unitsOnStock, 20); // 23 - 3 = 20

    // check whether rows added in Order Details table
    const [_, productCount1] =
      await testingContainer.repositories.orderDetailsRepository.findAndCount({
        where: {
          order: { id: result.id },
          product: { id: In([products[0].productId, products[1].productId]) },
        },
      });

    assert.strictEqual(productCount1, 2);
  });

  it('should throw an error when creating order, if product has insufficient units on stock', async () => {
    await assert.rejects(
      async () => {
        await testingContainer.services.ordersService.createOrder(
          user1.id,
          orderData2,
          PaymentStatusEnum.AWAITING
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

  it('should delete an order by valid order id', async () => {

    const order = await createOrder(testingContainer, orderData1, user1)

    await testingContainer.services.ordersService.destroy(order.id, user1.id);

    const orderDetails =
      await testingContainer.repositories.orderDetailsRepository.findOne({
        where: { order: { id: order.id } },
      });

    const deletedOrder = await testingContainer.repositories.ordersRepository.findOne({
      where: { id: order.id },
    });

    assert.strictEqual(orderDetails, null);
    assert.strictEqual(deletedOrder, null);

  });
});
