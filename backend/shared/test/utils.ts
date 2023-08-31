import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/auth/users/users.service';
import { ProductsService } from '../../src/products/products.service';
import { OrdersService } from '../../src/orders/orders.service';
import { CategoriesService } from '../../src/categories/categories.service';
import { OrderDetailsService } from '../../src/order.details/order.details.service';
import { ProductsReviewService } from '../../src/products.review/products.review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../src/auth/users/users.entity';
import { ProductsEntity } from '../../src/products/products.entity';
import { OrdersEntity } from '../../src/orders/orders.entity';
import { CategoriesEntity } from '../../src/categories/categories.entity';
import { OrderDetailsEntity } from '../../src/order.details/order.details.entity';
import { ProductsReviewEntity } from '../../src/products.review/products.review.entity';

export interface ITestingContainer {
  services: {
    usersService: UsersService;
    productsService: ProductsService;
    ordersService: OrdersService;
    categoriesService: CategoriesService;
    orderDetailsService: OrderDetailsService;
    productsReviewService: ProductsReviewService;
  };
  repositories: {
    usersRepository: Repository<UsersEntity>;
    productsRepository: Repository<ProductsEntity>;
    ordersRepository: Repository<OrdersEntity>;
    categoriesRepository: Repository<CategoriesEntity>;
    orderDetailsRepository: Repository<OrderDetailsEntity>;
    productsReviewRepository: Repository<ProductsReviewEntity>;
  };
}

export async function createTestingContainer(): Promise<ITestingContainer> {
  let testingModule: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return Promise.resolve({
    services: {
      usersService: testingModule.get(UsersService),
      productsService: testingModule.get(ProductsService),
      ordersService: testingModule.get(OrdersService),
      categoriesService: testingModule.get(CategoriesService),
      orderDetailsService: testingModule.get(OrderDetailsService),
      productsReviewService: testingModule.get(ProductsReviewService),
    },
    repositories: {
      usersRepository: testingModule.get<Repository<UsersEntity>>(
        getRepositoryToken(UsersEntity),
      ),
      productsRepository: testingModule.get<Repository<ProductsEntity>>(
        getRepositoryToken(ProductsEntity),
      ),
      ordersRepository: testingModule.get<Repository<OrdersEntity>>(
        getRepositoryToken(OrdersEntity),
      ),
      categoriesRepository: testingModule.get<Repository<CategoriesEntity>>(
        getRepositoryToken(CategoriesEntity),
      ),
      orderDetailsRepository: testingModule.get<Repository<OrderDetailsEntity>>(
        getRepositoryToken(OrderDetailsEntity),
      ),
      productsReviewRepository: testingModule.get<
        Repository<ProductsReviewEntity>
      >(getRepositoryToken(ProductsReviewEntity)),
    },
  });
}

export async function clearDataBaseData(testingModule: ITestingContainer) {
  const { repositories } = testingModule;
  const repositoriesToClear = Object.values(repositories);

  // perform clearing of data from individual tables sequentially instead of
  // in parallel, thus for ... of instead of map

  for (const repository of repositoriesToClear) {
    const tableName = repository.metadata.tableName;
    const query = `TRUNCATE TABLE ${tableName} CASCADE;`;
    await repository.query(query);
  }
}

