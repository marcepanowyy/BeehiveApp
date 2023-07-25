// import { createTestingContainer } from './utils';
//
// const testingContainer = await createTestingContainer();
//
// export async function createCategory(categoryData) {
//   const category =
//     testingContainer.repositories.categoriesRepository.create(categoryData);
//   await testingContainer.repositories.categoriesRepository.save(category);
//   return category;
// }
//

import { ITestingContainer } from './utils';
import { CategoriesEntity } from '../../src/categories/categories.entity';
import { UsersEntity } from '../../src/auth/users/users.entity';
import { ProductsEntity } from '../../src/products/products.entity';


export async function createUser(testingContainer: ITestingContainer, userData): Promise<UsersEntity> {
  const user = testingContainer.repositories.usersRepository.create(userData);
  await testingContainer.repositories.usersRepository.save(user);
  return user as UsersEntity
}

export async function createCategory(testingContainer: ITestingContainer, categoryData): Promise<CategoriesEntity> {
  const category =
    testingContainer.repositories.categoriesRepository.create(categoryData);
  await testingContainer.repositories.categoriesRepository.save(category);
  return category as CategoriesEntity;
}

export async function createProduct(testingContainer: ITestingContainer, productData, category: CategoriesEntity): Promise<ProductsEntity> {
  const product = testingContainer.repositories.productsRepository.create({
    ...productData,
    category,
  });
  await testingContainer.repositories.productsRepository.save(product);
  return product as ProductsEntity;
}


//
// export async function createOrder(orderData, customer) {
//   const order: any =
//     testingContainer.repositories.ordersRepository.create(customer);
//   await testingContainer.repositories.ordersRepository.save(order);
//
//   for (const reqProd of orderData) {
//     const product =
//       await testingContainer.repositories.productsRepository.findOne({
//         where: { id: reqProd.id },
//       });
//     await testingContainer.repositories.productsRepository.update(product.id, {
//       unitsOnStock: product.unitsOnStock - reqProd.quantity,
//     });
//
//     const orderDetails =
//       testingContainer.repositories.orderDetailsRepository.create({
//         product,
//         order,
//         quantity: reqProd.quantity,
//       });
//
//     await testingContainer.repositories.orderDetailsRepository.save(
//       orderDetails,
//     );
//   }
// }