export class CartItem {
  productId: string;
  quantity: number;
}

export class ProcessedCartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export class ProductForOrder {
  productId: string;
  quantity: number;
  currency: string;
}

export class UserFromStripeEvent {
  userId: string;
  recipient: string;
}

export class ProductFromEvent {
  productId: string;
  name: string;
  quantity: number;
  currency: string;
  unitAmount: number;
  image: string | null;
}