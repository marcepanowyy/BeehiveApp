import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { ProductForOrder } from '../payments/payments.dto';
import { PaymentStatusEnum } from '../../shared/enums/payment.status.enum';

@Injectable()
export class MailingService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('MAIL_CLIENT') private client: ClientProxy,
  ) {}

  async sendWelcomeMail(recipient: string): Promise<void> {
    console.log('Enqueueing welcome mail at', this.currentTimestamp);
    return this.publishToQueue('welcome-mail', { recipient });
  }

  async sendActivationMail(recipient: string): Promise<void> {
    console.log('Enqueueing activation mail at', this.currentTimestamp);
    const activationCode = await this.generateActivationCode(recipient);
    return this.publishToQueue('activation-mail', {
      recipient,
      activationCode,
    });
  }

  async sendPasswordResetMail(recipient: string): Promise<void> {
    console.log('Enqueueing password reset mail at', this.currentTimestamp);
    const resetCode = await this.generatePasswordResetCode(recipient);
    return this.publishToQueue('password-reset-mail', {
      recipient,
      resetCode,
    });
  }

  async sendPaymentConfirmationMail(
    recipient: string,
    products: ProductForOrder[],
    paymentStatus: PaymentStatusEnum,
  ): Promise<void> {
    console.log(
      'Enqueueing payment confirmation mail at',
      this.currentTimestamp,
    );
    return this.publishToQueue('payment-confirmation-mail', {
      recipient,
      products,
      paymentStatus,
    });
  }

  private async publishToQueue(pattern: string, data: any): Promise<void> {
    await this.client.emit(pattern, data);
  }

  private async generateActivationCode(recipient: string): Promise<string> {
    const verificationKey = crypto.randomUUID();
    const expirationTime = 10 * 60 * 1000; // 10 minutes

    await this.cacheManager.set(
      `temp-user-email-verification-key__${verificationKey}`,
      recipient,
      expirationTime,
    );

    return `http://localhost:4000/auth/activate/${verificationKey}`;
  }

  async generatePasswordResetCode(recipient: string): Promise<string> {
    const code = Math.floor(Math.random() * 899999 + 100000) + ''; // 6 digit code
    const expirationTime = 10 * 60 * 1000; // 10 minutes

    await this.cacheManager.set(
      `temp-user-reset-password-key__${recipient}`,
      code,
      expirationTime,
    );

    return code;
  }

  get currentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;
  }
}
