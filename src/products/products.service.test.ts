import { before, beforeEach, describe, it } from 'node:test';
import { clearDataBaseData, createTestingContainer, ITestingContainer } from '../../shared/test/utils';
import { strict as assert } from 'node:assert';

describe('UsersService', () => {
  let testingContainer: ITestingContainer;

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {
    await clearDataBaseData(testingContainer);
  });

  it('should create a product with valid data', async () => {

    const categoryData = {
      name: "testCategoryName",
      description: "testCategoryDescription"
    }

    const category = await testingContainer.repositories.categoriesRepository.create(categoryData)
    await testingContainer.repositories.categoriesRepository.save(category)

    const productData = {
      name: 'testProductName',
      description: 'testProductDescription',
      unitsOnStock: 2,
      price: 21.37,
      categoryId: category.id,
    };

    const result = await testingContainer.services.productsService.create(productData)

    assert.strictEqual(result.name, productData.name);
    assert.strictEqual(result.description, productData.description);
    assert.strictEqual(result.unitsOnStock, productData.unitsOnStock);
    assert.strictEqual(result.price, productData.price);
    assert.strictEqual(result.category, categoryData.name);

  })

  it('should update a product with valid data', async () => {

    const categoryData = {
      name: "testCategoryName",
      description: "testCategoryDescription"
    }

    const category = await testingContainer.repositories.categoriesRepository.create(categoryData)
    await testingContainer.repositories.categoriesRepository.save(category)

    const productData = {
      name: 'testProductName',
      description: 'testProductDescription',
      unitsOnStock: 2,
      price: 21.37,
      category
    };

    const product = await testingContainer.repositories.productsRepository.create(productData)
    await testingContainer.repositories.productsRepository.save(product)

    const ProductPartialData = {
      name: 'testUpdatedProductName',
      description: 'testUpdatedProductDescription',
      unitsOnStock: 10,
      price: 1.32,
    }

    const result = await testingContainer.services.productsService.update(product.id, ProductPartialData)

    assert.strictEqual(result.id, product.id);
    assert.strictEqual(result.name, ProductPartialData.name);
    assert.strictEqual(result.description, ProductPartialData.description);
    assert.strictEqual(result.unitsOnStock, ProductPartialData.unitsOnStock);

    //The price field is using the numeric column type. The numeric type in
    // TypeORM maps the value to a string to preserve full precision and avoid
    // the loss of significant digits.
    assert.strictEqual(parseFloat(String(result.price)), ProductPartialData.price);

  })

  it('should delete a product with valid data', async () => {

    const categoryData = {
      name: "testCategoryName",
      description: "testCategoryDescription"
    }

    const category = await testingContainer.repositories.categoriesRepository.create(categoryData)
    await testingContainer.repositories.categoriesRepository.save(category)

    const productData = {
      name: 'testProductName',
      description: 'testProductDescription',
      unitsOnStock: 2,
      price: 21.37,
      category
    };

    const product = await testingContainer.repositories.productsRepository.create(productData)
    await testingContainer.repositories.productsRepository.save(product)

    await testingContainer.services.productsService.delete(product.id)

    const foundProduct = await testingContainer.repositories.productsRepository.findOne({where: {id: product.id}})
    const foundCategory = await testingContainer.repositories.categoriesRepository.findOne({where: {id: category.id}})

    assert.strictEqual(foundProduct, null)
    assert.deepStrictEqual(foundCategory, category)

  })

  it('should filter products with valid partial filter data', async () => {

    const categoryData1 = {
      name: "testCategoryName1",
      description: "testCategoryDescription1"
    }

    const categoryData2 = {
      name: "testCategoryName2",
      description: "testCategoryDescription2"
    }

    const category1 = await testingContainer.repositories.categoriesRepository.create(categoryData1)
    await testingContainer.repositories.categoriesRepository.save(category1)

    const category2 = await testingContainer.repositories.categoriesRepository.create(categoryData2)
    await testingContainer.repositories.categoriesRepository.save(category2)

    const productData1 = {
      name: 'testProductName1',
      description: 'testProductDescription1',
      unitsOnStock: 2,
      price: 21.37,
      category: category1
    };

    const productData2 = {
      name: 'testProductName2',
      description: 'testProductDescription2',
      unitsOnStock: 23,
      price: 1,
      category: category1
    };

    const productData3 = {
      name: 'testProductName3',
      description: 'testProductDescription3',
      unitsOnStock: 0,
      price: 999,
      category: category2
    };

    const product1 = await testingContainer.repositories.productsRepository.create(productData1)
    await testingContainer.repositories.productsRepository.save(product1)

    const product2 = await testingContainer.repositories.productsRepository.create(productData2)
    await testingContainer.repositories.productsRepository.save(product2)

    const product3 = await testingContainer.repositories.productsRepository.create(productData3)
    await testingContainer.repositories.productsRepository.save(product3)

    const partialFilterData1 = {
      descending: true,
      maxPrice: 40,
    }

    const partialFilterData2 = {
      maxPrice: 800,
      minPrice: 500,
      categoryIdArr: [category1.id, category2.id]
    }

    const partialFilterData3 = {
      descending: true,
      minPrice: 950,
      categoryIdArr: []
    }

    const partialFilterData4 = {
      ascending: true,
      minPrice: 1,
      maxPrice: 999,
      categoryIdArr: [category1.id, category2.id]
    }

    const partialFilterData5 = {
      maxPrice: 20,
      categoryIdArr: [category2.id]
    }

    const res1: any = await testingContainer.services.productsService.getFilteredProducts(partialFilterData1)
    const res2: any = await testingContainer.services.productsService.getFilteredProducts(partialFilterData2)
    const res3: any = await testingContainer.services.productsService.getFilteredProducts(partialFilterData3)
    const res4: any = await testingContainer.services.productsService.getFilteredProducts(partialFilterData4)
    const res5: any = await testingContainer.services.productsService.getFilteredProducts(partialFilterData5)

    const final1 = res1.products.map(product => product.id)
    const final2 = res2.products.map(product => product.id)
    const final3 = res3.products.map(product => product.id)
    const final4 = res4.products.map(product => product.id)
    const final5 = res5.products.map(product => product.id)

    assert.deepStrictEqual(final1, [product1.id, product2.id])
    assert.deepStrictEqual(final2, [])
    assert.deepStrictEqual(final3, [product3.id])
    assert.deepStrictEqual(final4, [product2.id, product1.id, product3.id])
    assert.deepStrictEqual(final5, [])

  })



});