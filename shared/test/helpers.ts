import { ITestingContainer } from './utils';
import { CategoriesEntity } from '../../src/categories/categories.entity';
import { UsersEntity } from '../../src/auth/users/users.entity';
import { ProductsEntity } from '../../src/products/products.entity';
import { OrdersEntity } from '../../src/orders/orders.entity';

// casting because create returns array of object which is falsy

export async function createUser(
  testingContainer: ITestingContainer,
  userData,
): Promise<UsersEntity> {
  const user = testingContainer.repositories.usersRepository.create(userData);
  await testingContainer.repositories.usersRepository.save(user);
  return user as unknown as UsersEntity;
}

export async function createCategory(
  testingContainer: ITestingContainer,
  categoryData,
): Promise<CategoriesEntity> {
  const category =
    testingContainer.repositories.categoriesRepository.create(categoryData);
  await testingContainer.repositories.categoriesRepository.save(category);
  return category as unknown as CategoriesEntity;
}

export async function createProduct(
  testingContainer: ITestingContainer,
  productData,
  category: CategoriesEntity,
): Promise<ProductsEntity> {
  const product = testingContainer.repositories.productsRepository.create({
    ...productData,
    category,
  });
  await testingContainer.repositories.productsRepository.save(product);
  return product as unknown as ProductsEntity;
}

export async function createOrder(testingContainer, orderData, customer): Promise<OrdersEntity> {

  const order =
    await testingContainer.repositories.ordersRepository.create({ customer: customer });
  await testingContainer.repositories.ordersRepository.save(order);

  for (const reqProd of orderData.productsArray) {
    const product =
      await testingContainer.repositories.productsRepository.findOne({
        where: { id: reqProd.id },
      });
    await testingContainer.repositories.productsRepository.update(product.id, {
      unitsOnStock: product.unitsOnStock - reqProd.quantity,
    });

    const orderDetails =
      testingContainer.repositories.orderDetailsRepository.create({
        product,
        order,
        quantity: reqProd.quantity,
      });

    await testingContainer.repositories.orderDetailsRepository.save(
      orderDetails,
    );
  }

  return order as unknown as OrdersEntity
}
