import { Test, TestingModule } from '@nestjs/testing';
import { ProductsReviewService } from './products.review.service';

describe('ProductsReviewService', () => {
  let service: ProductsReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsReviewService],
    }).compile();

    service = module.get<ProductsReviewService>(ProductsReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
