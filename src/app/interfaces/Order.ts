import {Product} from "./Product";

export interface Order{

  orderId: string;
  name: string;
  description: string;
  status: string;
  products: Product[]
  created: Date

}
