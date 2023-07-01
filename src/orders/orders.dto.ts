import { IsNotEmpty, IsString } from 'class-validator';
import { UsersRO } from '../users/users.dto';

export class OrdersDto {

  // TODO
  // user: usersdto
  // products: productsdto[]

  // @IsNotEmpty()
  // @IsString()
  status?: string;

}

export class OrdersRo{

  id?: string;
  updated: Date;
  created: Date;
  status: string;
  customer: UsersRO


}


