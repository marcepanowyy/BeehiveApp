import { createTestingContainer } from './utils';

const testingContainer = await createTestingContainer();

export async function createCategory(categoryData) {
  const category =
    testingContainer.repositories.categoriesRepository.create(categoryData);
  await testingContainer.repositories.categoriesRepository.save(category);
  return category;
}

export async function createProduct(productData, category) {
  const product = testingContainer.repositories.productsRepository.create({
    ...productData,
    category,
  });
  await testingContainer.repositories.productsRepository.save(product);
  return product;
}

export async function createUser(userData) {
  const user = testingContainer.repositories.usersRepository.create(userData);
  await testingContainer.repositories.usersRepository.save(user);
  return user;
}

export async function createOrder(orderData, customer) {
  const order: any =
    testingContainer.repositories.ordersRepository.create(customer);
  await testingContainer.repositories.ordersRepository.save(order);

  for (const reqProd of orderData) {
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
}
