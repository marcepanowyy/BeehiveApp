import { Test, TestingModule } from '@nestjs/testing';
import { ProductsReviewController } from './products.review.controller';

describe('ProductsReviewController', () => {
  let controller: ProductsReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsReviewController],
    }).compile();

    controller = module.get<ProductsReviewController>(ProductsReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
