// import { before, beforeEach, describe, it } from 'node:test';
// import {
//   clearDataBaseData,
//   createTestingContainer,
//   ITestingContainer,
// } from '../../shared/test/utils';
// import { strict as assert } from 'node:assert';
//
// describe('CategoriesService', () => {
//
//   let testingContainer: ITestingContainer;
//
//   let categoryData
//
//   before(async () => {
//     testingContainer = await createTestingContainer();
//   });
//
//   beforeEach(async () => {
//     await clearDataBaseData(testingContainer);
//
//     categoryData = {
//       name: 'testCategory',
//       description: 'testDescription',
//     };
//
//   });
//
//   it('should create category with valid data', async () => {
//
//     const result = await testingContainer.services.categoriesService.create(
//       categoryData,
//     );
//
//     const category =
//       await testingContainer.repositories.categoriesRepository.findOne({
//         where: { id: result.id },
//       });
//
//     assert.strictEqual(result.name, category.name);
//     assert.strictEqual(result.description, category.description);
//   });
//
//   it('should update category with valid data', async () => {
//
//     const categoryData = {
//       name: 'testCategory',
//       description: 'testDescription',
//     };
//
//     const category =
//       testingContainer.repositories.categoriesRepository.create(
//         { ...categoryData },
//       );
//     await testingContainer.repositories.categoriesRepository.save(category);
//
//     const partialCategoryData = {
//       name: 'testUpdatedCategoryName',
//       description: 'testUpdatedCategoryDescription',
//     };
//
//     const result = await testingContainer.services.categoriesService.update(
//       category.id,
//       partialCategoryData,
//     );
//     const updatedCategory =
//       await testingContainer.repositories.categoriesRepository.findOne({
//         where: { id: category.id },
//       });
//
//     assert.strictEqual(result.id, updatedCategory.id);
//     assert.strictEqual(result.name, updatedCategory.name);
//     assert.strictEqual(result.description, updatedCategory.description);
//   });
//
//   it('should delete category with valid data and cascade deleting created products', async () => {
//
//     const categoryData = {
//       name: 'testCategory',
//       description: 'testDescription',
//     };
//
//     const category =
//       await testingContainer.repositories.categoriesRepository.create({
//         ...categoryData,
//       });
//     await testingContainer.repositories.categoriesRepository.save(category);
//
//     const productData1 = {
//       name: 'testProductName1',
//       description: 'testProductDescription1',
//       unitsOnStock: 2,
//       price: 21.37,
//       category,
//     };
//
//     const productData2 = {
//       name: 'testProductName2',
//       description: 'testProductDescription2',
//       unitsOnStock: 999,
//       price: 21.37,
//       category,
//     };
//
//     const product1 =
//       await testingContainer.repositories.productsRepository.create({
//         ...productData1,
//       });
//     await testingContainer.repositories.productsRepository.save(product1);
//
//     const product2 =
//       await testingContainer.repositories.productsRepository.create({
//         ...productData2,
//       });
//     await testingContainer.repositories.productsRepository.save(product2);
//
//     await testingContainer.services.categoriesService.delete(category.id);
//
//     const foundCategory =
//       await testingContainer.repositories.categoriesRepository.findOne({
//         where: { id: category.id },
//       });
//     const foundProducts =
//       await testingContainer.repositories.productsRepository.find({
//         where: { category: { id: category.id } }
//       });
//
//     assert.strictEqual(foundCategory, null);
//     assert.deepEqual(foundProducts, []);
//
//   });
// });