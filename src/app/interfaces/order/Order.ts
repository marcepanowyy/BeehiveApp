import {CartProduct} from "../product/CartProduct";
import {UserRO} from "../user/UserRO";

export interface Order{

  orderId: string;
  description?: string;
  customer?: UserRO
  status: string;
  products: CartProduct[];
  created: Date;

}
