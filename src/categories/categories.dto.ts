import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

}

export class CategoriesRo {
  id: string;
  created: Date;
  updated: Date;
  name: string;
  description: string;
  // products: ProductEntity[]
}
