export class WelcomeMessage {
  pattern: string;
  data: {
    recipient: string;
  };
}

export class ActivationMessage {
  pattern: string;
  data: {
    recipient: string;
    activationCode: string;
  };
}

export class PasswordResetMessage {
  pattern: string;
  data: {
    recipient: string;
    resetCode: string;
  };
}

export class PaymentConfirmationMessage {
  pattern: string;
  data: {
    recipient: string;
    products: ProductForOrder[];
    paymentStatus: PaymentStatusEnum
  }
}

export class ProductForOrder {
  productId: string;
  name: string;
  quantity: number;
  currency: string;
  unitAmount: number;
  image: string | null;
}

export enum PaymentStatusEnum {
  AWAITING = 1,
  PAID = 2,
  REFUNDED = 3,
}
