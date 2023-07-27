import { strict as assert } from 'node:assert';

import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../shared/test/utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { sampleCategoryData, sampleProductData, sampleUserData } from '../../shared/test/samples';
import { createCategory, createOrder, createProduct, createUser } from '../../shared/test/helpers';

describe('ProductsReviewService', () => {
  let testingContainer: ITestingContainer;

  const categoryData1 = sampleCategoryData.categoryData1;
  const productData1 = sampleProductData.productData1;
  const userData1 = sampleUserData.userData1;
  const userData2 = sampleUserData.userData2;


  let category;
  let product;
  let user1, user2;
  let order;
  let productReviewData;

  before(async () => {

    testingContainer = await createTestingContainer();
    await clearDataBaseData(testingContainer);

    category = await createCategory(testingContainer, categoryData1)
    product = await createProduct(testingContainer, productData1, category)
    user1 = await createUser(testingContainer, userData1)
    user2 = await createUser(testingContainer, userData2)

    const orderData = {
      productsArray: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    };

    order = await createOrder(testingContainer, orderData, user1)

    productReviewData = {
      content: 'This is valid content because it has between 10 and 100 chars',
      rating: 5,
    };

  });

  it('should create a review with valid data', async () => {

    const review = await testingContainer.services.productsReviewService.create(
      user1.id,
      productReviewData,
      product.id,
    );

    const addedReview = await testingContainer.repositories.productsReviewRepository.findOne({where: {id: review.id}})

    assert.notStrictEqual(addedReview, null)
    assert.strictEqual(review.id, addedReview.id)
    assert.strictEqual(review.customer.id, user1.id)
    assert.strictEqual(review.product.id, product.id)

  });

  it('should throw an error when creating review when user did not buy the product', async () => {

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

  // it('should update a review by the user it was created with valid data')

  // it('should throw an error when updating review which was created by other user')

});
