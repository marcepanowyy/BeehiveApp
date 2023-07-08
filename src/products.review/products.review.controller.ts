import { Body, Controller, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';
import { ProductsReviewDto } from './products.review.dto';
import { ProductsReviewService } from './products.review.service';
import { ValidationPipe } from '../../shared/validation.pipe';

@Controller('products/reviews')
export class ProductsReviewController {
  constructor(private productsReviewService: ProductsReviewService) {}

  @Post(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  createReview(
    @User('id') userId,
    @Body() data: ProductsReviewDto,
    @Param('id') productId: string,
  ) {
    console.log(userId, data, productId)
    return this.productsReviewService.create(userId, data, productId);
  }
}
