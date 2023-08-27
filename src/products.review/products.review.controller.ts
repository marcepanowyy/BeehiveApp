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
import { ProductsReviewDto, ReviewRO } from './products.review.dto';
import { ProductsReviewService } from './products.review.service';
import { ValidationPipe } from '../../shared/validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';
import { Role } from '../../shared/decorators/roles.decorator';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';

@ApiTags('reviews')
@Controller('reviews')
export class ProductsReviewController {

  constructor(private productsReviewService: ProductsReviewService) {}

  @Get()

  @ApiOperation({ summary: 'Get all product reviews with pagination' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiOkResponse({ description: 'Product reviews retrieved successfully.', type: ReviewRO })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  showAll(@Query('page') page: number) {
    return this.productsReviewService.showAll(page);
  }

  @Get(':id')

  @ApiOperation({ summary: 'Get a product review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiOkResponse({ description: 'Product review retrieved successfully.', type: ReviewRO })
  @ApiNotFoundResponse({ description: "Review with the specified ID was not found." })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  readReview(@Param('id') reviewId: string) {
    return this.productsReviewService.showReviewById(reviewId);
  }

  @Post(':id')
  @UseGuards(new AuthGuard())
  @Role(UserRoleEnum.CUSTOMER)
  @UsePipes(new ValidationPipe())

  @ApiOperation({ summary: 'Create a review for a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiBody({ type: ProductsReviewDto })
  @ApiOkResponse({ description: 'Review created successfully.', type: ReviewRO })
  @ApiNotFoundResponse({ description: "Product or User with the specified ID was not found." })
  @ApiUnauthorizedResponse({ description: "User did not purchase the product." })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

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

  @ApiOperation({ summary: 'Update a product review' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 'b29ff321-e113-44b4-b776-92c044ad2157' })
  @ApiBody({ type: PartialType(ProductsReviewDto) })
  @ApiOkResponse({ description: 'Review updated successfully.', type: ReviewRO })
  @ApiNotFoundResponse({ description: 'Review with the specified ID was not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  updateReview(
    @User('id') userId: string,
    @Param('id') reviewId: string,
    @Body() data: Partial<ProductsReviewDto>,
  ) {
    return this.productsReviewService.updateReview(userId, reviewId, data);
  }

}
