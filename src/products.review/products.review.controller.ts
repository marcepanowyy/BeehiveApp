import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/users.decorator';
import { ProductsReviewDto } from './products.review.dto';
import { ProductsReviewService } from './products.review.service';
import { ValidationPipe } from '../../shared/validation.pipe';

@Controller('reviews')
export class ProductsReviewController {
  constructor(private productsReviewService: ProductsReviewService) {}

  @Get()
  showAll(@Query('page') page: number) {
    return this.productsReviewService.showAll(page);
  }

  @Get(':id')
  readReview(@Param('id') reviewId: string){
    return this.productsReviewService.showReviewById(reviewId)
  }

  @Post(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  createReview(
    @User('id') userId,
    @Body() data: ProductsReviewDto,
    @Param('id') productId: string,
  ) {
    return this.productsReviewService.create(userId, data, productId);
  }
}
