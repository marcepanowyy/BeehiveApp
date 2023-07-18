import { before, beforeEach, describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../shared/test/utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StatusEnum } from '../../shared/enums/status.enum';

describe('ProductsReviewService', () => {
  let testingContainer: ITestingContainer;

  let categoryData, category;
  let productData, product;
  let userData, user;
  let orderData, order;
  let orderDetails;
  let productReviewData;

  before(async () => {

    testingContainer = await createTestingContainer();
    await clearDataBaseData(testingContainer);

    categoryData = {
      name: 'testCategoryName1',
      description: 'testCategoryDescription1',
    };

    category =
      testingContainer.repositories.categoriesRepository.create(categoryData);
    await testingContainer.repositories.categoriesRepository.save(category);

    productData = {
      name: 'testProductName1',
      description: 'testProductDescription1',
      unitsOnStock: 2,
      price: 21.37,
      category: category,
    };

    product =
      testingContainer.repositories.productsRepository.create(productData);
    await testingContainer.repositories.productsRepository.save(product);

    userData = {
      username: 'test@user.com',
      password: 'tE$Tp4sSw0rd123',
    };

    user = testingContainer.repositories.usersRepository.create(userData);
    await testingContainer.repositories.usersRepository.save(user);

    orderData = {
      productsArray: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    };

    await testingContainer.repositories.productsRepository.update(product.id, {
      unitsOnStock: product.unitsOnStock - 1,
    });

    order = await testingContainer.repositories.ordersRepository.create({
      customer: user,
    });
    await testingContainer.repositories.ordersRepository.save(order);

    orderDetails =
      await testingContainer.repositories.orderDetailsRepository.create({
        product: product,
        order: order,
        quantity: 1,
      });

    await testingContainer.repositories.orderDetailsRepository.save(
      orderDetails,
    );

    productReviewData = {
      content: 'This is valid content because it has between 10 and 100 chars',
      rating: 5,
    };

  });

  it('should create a review with valid data', async () => {

    const review = await testingContainer.services.productsReviewService.create(
      user.id,
      productReviewData,
      product.id,
    );

    const addedReview = await testingContainer.repositories.productsReviewRepository.findOne({where: {id: review.id}})


    assert.notStrictEqual(addedReview, null)
    assert.strictEqual(review.id, addedReview.id)
    assert.strictEqual(review.customer.id, user.id)
    assert.strictEqual(review.product.id, product.id)

  });

  it('should throw an error when creating review when user did not buy the product', async () => {

    const userData2 = {
      username: 'test2@user.com',
      password: 'tE$Tp4sSw0rd123',
    };

    const user2 = testingContainer.repositories.usersRepository.create(userData2);
    await testingContainer.repositories.usersRepository.save(user2);

    await assert.rejects(
      async () => {
        await testingContainer.services.productsReviewService.create(
          user2.id,
          productReviewData,
          product.id
        );
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(
          err.response,
          'User did not purchase the product',
        );
        assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
        return true;
      })

  })

  // TODO - finish tests:

  it('should update a review by the user it was created with valid data')

  it('should throw an error when updating review which was created by other user')

});
