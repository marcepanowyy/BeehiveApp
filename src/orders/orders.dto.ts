import { IsNotEmpty, IsString } from 'class-validator';

export class OrdersDto {

  // TODO
  // user: usersdto
  // products: productsdto[]

  @IsNotEmpty()
  @IsString()
  status: string;

}


