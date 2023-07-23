import { createTestingContainer, ITestingContainer } from '../../shared/test/utils';
import { validate } from 'class-validator';
import { strict as assert } from 'node:assert';
import { CategoriesDto } from './categories.dto';

describe("CategoriesDto (Categories' Data Transfer Object)", () => {

  let testingContainer: ITestingContainer;
  let testCategoryData

  before(async () => {
    testingContainer = await createTestingContainer();
    testCategoryData = require('../../shared/test/samples/categoriesSample')
  });

  it('should validate valid categories', async () => {
    for (const category of testCategoryData.valid) {
      const categoriesDto = new CategoriesDto();
      categoriesDto.name = category.name;
      categoriesDto.description = category.description;

      const errors = await validate(categoriesDto);
      assert.strictEqual(errors.length, 0);
    }
  });

  it('should validate invalid names', async () => {
    for (const category of testCategoryData.invalid.names) {
      const categoriesDto = new CategoriesDto();
      categoriesDto.name = category.name;
      categoriesDto.description = category.description;

      const errors = await validate(categoriesDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });

  it('should validate invalid descriptions', async () => {
    for (const category of testCategoryData.invalid.descriptions) {
      const categoriesDto = new CategoriesDto();
      categoriesDto.name = category.name;
      categoriesDto.description = category.description;

      const errors = await validate(categoriesDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });

  it('should validate invalid categories', async () => {
    for (const category of testCategoryData.invalid.both) {
      const categoriesDto = new CategoriesDto();
      categoriesDto.name = category.name;
      categoriesDto.description = category.description;

      const errors = await validate(categoriesDto);
      assert.strictEqual(errors.length > 0, true);
    }
  });
});
