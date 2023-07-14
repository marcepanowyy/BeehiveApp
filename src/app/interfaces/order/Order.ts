import {CartProduct} from "../product/CartProduct";

export interface Order{

  orderId: string;
  name: string;
  description: string;
  status: string;
  products: CartProduct[];
  created: Date;

}
