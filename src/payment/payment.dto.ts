export class CartItem {
  productId: string;
  quantity: number;
}

export class ProcessedCartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export class ProductForOrder {
  productId: string;
  name: string;
  quantity: number;
  currency: string;
  unitAmount: number;
  image: string | null;
}

export class UserFromStripeEvent {
  userId: string;
  recipient: string;
}
