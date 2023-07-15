import {UserResponse} from "../user/UserResponse";

export interface OrderResponse{
  orderId: string;
  customer: Partial<UserResponse>;
  created: Date;
  products: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[]
}
