import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../shared/test/utils';
import { strict as assert } from 'node:assert';
import { sampleCategoryData, sampleProductData } from '../../shared/test/samples';
import { createCategory, createProduct } from '../../shared/test/helpers';

describe('CategoriesService', () => {

  let testingContainer: ITestingContainer;
  const categoryData = sampleCategoryData.categoryData1

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {
    await clearDataBaseData(testingContainer);
  });

  it('should create category with valid data', async () => {

    const result = await testingContainer.services.categoriesService.create(
      categoryData,
    );

    const category =
      await testingContainer.repositories.categoriesRepository.findOne({
        where: { id: result.id },
      });

    assert.strictEqual(result.name, category.name);
    assert.strictEqual(result.description, category.description);
  });

  it('should update category with valid data', async () => {

    const category = await createCategory(testingContainer, categoryData)

    const updatedCategoryData = {
      name: 'testUpdatedCategoryName',
      description: 'testUpdatedCategoryDescription',
    };

    const result = await testingContainer.services.categoriesService.update(
      category.id,
      updatedCategoryData,
    );
    const updatedCategory =
      await testingContainer.repositories.categoriesRepository.findOne({
        where: { id: category.id },
      });

    assert.strictEqual(result.id, updatedCategory.id);
    assert.strictEqual(result.name, updatedCategory.name);
    assert.strictEqual(result.description, updatedCategory.description);
  });

  it('should delete category with valid data and cascade deleting created products', async () => {

    const category = await createCategory(testingContainer, categoryData)

    await createProduct(testingContainer, sampleProductData.productData1, category)
    await createProduct(testingContainer, sampleProductData.productData2, category)

    await testingContainer.services.categoriesService.delete(category.id);

    const foundCategory =
      await testingContainer.repositories.categoriesRepository.findOne({
        where: { id: category.id },
      });
    const foundProducts =
      await testingContainer.repositories.productsRepository.find({
        where: { category: { id: category.id } }
      });

    assert.strictEqual(foundCategory, null);
    assert.deepEqual(foundProducts, []);

  });
});