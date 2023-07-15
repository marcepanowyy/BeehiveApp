import {CartProduct} from "../product/CartProduct";
import {UserResponse} from "../user/UserResponse";

export interface Order{
  orderId: string;
  customer: Partial<UserResponse>;
  products: Partial<CartProduct>[];
  status: string;
}
