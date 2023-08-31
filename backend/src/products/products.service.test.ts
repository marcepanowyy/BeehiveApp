import { clearDataBaseData, createTestingContainer, ITestingContainer } from '../../shared/test/utils';
import { strict as assert } from 'node:assert';
import { sampleCategoryData, sampleProductData } from '../../shared/test/samples';
import { createCategory, createProduct } from '../../shared/test/helpers';

describe('ProductsService', () => {

  let testingContainer: ITestingContainer;
  const categoryData1 = sampleCategoryData.categoryData1;
  const categoryData2 = sampleCategoryData.categoryData2;
  const productData1 = sampleProductData.productData1;
  const productData2 = sampleProductData.productData2;
  const productData3 = sampleProductData.productData3;

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {
    await clearDataBaseData(testingContainer);
  });

  it('should create a product with valid data', async () => {

    const category = await createCategory(testingContainer, categoryData1)

    const productData = { ...productData1, categoryId: category.id }

    const result = await testingContainer.services.productsService.create(productData)

    assert.strictEqual(result.name, productData.name);
    assert.strictEqual(result.description, productData.description);
    assert.strictEqual(result.unitsOnStock, productData.unitsOnStock);
    assert.strictEqual(result.unitPrice, productData.unitPrice);
    assert.strictEqual(result.category, categoryData1.name);

  })

  it('should update a product with valid data', async () => {

    const category = await createCategory(testingContainer, categoryData1)

    const product = await createProduct(testingContainer, productData1, category)

    const ProductPartialData = {
      name: 'testUpdatedProductName',
      description: 'testUpdatedProductDescription',
      unitsOnStock: 10,
      unitPrice: 132,
    }

    const result = await testingContainer.services.productsService.update(product.id, ProductPartialData)

    assert.strictEqual(result.id, product.id);
    assert.strictEqual(result.name, ProductPartialData.name);
    assert.strictEqual(result.description, ProductPartialData.description);
    assert.strictEqual(result.unitsOnStock, ProductPartialData.unitsOnStock);
    assert.strictEqual(result.unitPrice, ProductPartialData.unitPrice);

  })

  it('should delete a product with valid data', async () => {

    const category = await createCategory(testingContainer, categoryData1)
    const product = await createProduct(testingContainer, productData1, category)

    await testingContainer.services.productsService.delete(product.id)

    const foundProduct = await testingContainer.repositories.productsRepository.findOne({where: {id: product.id}})
    const foundCategory = await testingContainer.repositories.categoriesRepository.findOne({where: {id: category.id}})

    assert.strictEqual(foundProduct, null)
    assert.deepStrictEqual(foundCategory, category)

  })

  it('should filter products with valid partial filter data', async () => {

    const category1 = await createCategory(testingContainer, categoryData1)
    const category2 = await createCategory(testingContainer, categoryData2)

    const product1 = await createProduct(testingContainer, productData1, category1)
    const product2 = await createProduct(testingContainer, productData2, category1)
    const product3 = await createProduct(testingContainer, productData3, category2)

    const partialFilterData1 = {
      descending: true,
      maxUnitPrice: 4000,
    }

    const partialFilterData2 = {
      maxUnitPrice: 80000,
      minUnitPrice: 50000,
      categoryIdArr: [category1.id, category2.id]
    }

    const partialFilterData3 = {
      descending: true,
      minUnitPrice: 95000,
      categoryIdArr: []
    }

    const partialFilterData4 = {
      ascending: true,
      minUnitPrice: 100,
      maxUnitPrice: 99900,
      categoryIdArr: [category1.id, category2.id]
    }

    const partialFilterData5 = {
      maxUnitPrice: 2000,
      categoryIdArr: [category2.id]
    }

    const res1 = (await testingContainer.services.productsService.getFilteredProducts(partialFilterData1)).products.map(product => product.id)
    const res2 = (await testingContainer.services.productsService.getFilteredProducts(partialFilterData2)).products.map(product => product.id)
    const res3 = (await testingContainer.services.productsService.getFilteredProducts(partialFilterData3)).products.map(product => product.id)
    const res4 = (await testingContainer.services.productsService.getFilteredProducts(partialFilterData4)).products.map(product => product.id)
    const res5 = (await testingContainer.services.productsService.getFilteredProducts(partialFilterData5)).products.map(product => product.id)

    assert.deepStrictEqual(res1, [product1.id, product2.id])
    assert.deepStrictEqual(res2, [])
    assert.deepStrictEqual(res3, [product3.id])
    assert.deepStrictEqual(res4, [product2.id, product1.id, product3.id])
    assert.deepStrictEqual(res5, [])

  })
});