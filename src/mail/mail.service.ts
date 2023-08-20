import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MailService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('MAIL_CLIENT') private client: ClientProxy,
  ) {}

  async sendWelcomeMail(recipient: string): Promise<void> {
    console.log('Sending welcome mail to:', recipient);
    return this.publishToQueue('welcome-mail', { recipient });
  }

  async sendActivationMail(recipient: string): Promise<void> {
    console.log('Sending activation mail to:', recipient);
    const activationCode = await this.generateActivationCode(recipient);
    return this.publishToQueue('activation-mail', {
      recipient,
      activationCode,
    });
  }

  async sendPasswordResetMail(recipient: string): Promise<void> {
    console.log('Sending password reset mail to:', recipient);
    const resetCode = await this.generatePasswordResetCode(recipient);
    return this.publishToQueue('password-reset-mail', {
      recipient,
      resetCode,
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
}
