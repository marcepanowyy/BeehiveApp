import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from '../../shared/decorators/users.decorator';
import { ProductsReviewDto } from './products.review.dto';
import { ProductsReviewService } from './products.review.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('reviews')
@Controller('reviews')
export class ProductsReviewController {
  constructor(private productsReviewService: ProductsReviewService) {}

  @Get()
  showAll(@Query('page') page: number) {
    return this.productsReviewService.showAll(page);
  }

  @Get(':id')
  readReview(@Param('id') reviewId: string) {
    return this.productsReviewService.showReviewById(reviewId);
  }

  @Post(':id')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.CUSTOMER)
  @UsePipes(new ValidationPipe())
  createReview(
    @User('id') userId: string,
    @Body() data: ProductsReviewDto,
    @Param('id') productId: string,
  ) {
    return this.productsReviewService.create(userId, data, productId);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.CUSTOMER)
  @UsePipes(new ValidationPipe())
  updateReview(
    @User('id') userId: string,
    @Param('id') reviewId: string,
    @Body() data: Partial<ProductsReviewDto>,
  ) {
    return this.productsReviewService.updateReview(userId, reviewId, data);
  }
}
