import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import crypto from 'crypto';

@Injectable()
export class MailService {
  private passwordCodeLength = 6;
  private chars = '0123456789';

  constructor(
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendWelcomingMail(recipient: string): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      subject: 'Welcome to Our Community!',
      text: 'Welcome to our amazing community!',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <h2 style="color: #333;">Welcome to Our Community!</h2>
        <p style="color: #555;">Dear ${recipient},</p>
        <p style="color: #555;">We are thrilled to have you as a new member of our community!</p>
        <p style="color: #555;">Get ready for an exciting journey filled with learning and growth.</p>
        <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to us.</p>
        <p style="color: #555;">Thank you once again for joining us!</p>
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">The Beehive Team</p>
      </div>
    `,
    });
  }

  async sendActivatingMail(recipient: string): Promise<void> {
    const activationCode = await this.generateActivationCode(recipient);

    await this.mailerService.sendMail({
      to: recipient,
      subject: 'Activate Your Account',
      text: `Hello, ${recipient}!\n\nPlease use the following activation code to activate your account: ${activationCode}\n\nThank you!\n\nThe Beehive Team`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <h2 style="color: #333;">Activate Your Account</h2>
        <p style="color: #555;">Hello, ${recipient}!</p>
        <p style="color: #555;">Please use the following activation code to activate your account:</p>
        <p style="color: #555; font-size: 18px; padding: 10px; background-color: #ddd;">${activationCode}</p>
        <p style="color: #555;">Thank you for choosing Beehive</p>
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">The Beehive Team</p>
      </div>
    `,
    });
  }

  private async generateActivationCode(recipient: string): Promise<string> {
    const verificationKey = crypto.randomUUID();

    const expirationTime = 24 * 60 * 60 * 1000; // 1 day

    await this.cacheManager.set(
      `temp-user-email-verification-key__${verificationKey}`,
      recipient,
      expirationTime,
    );

    return `http://localhost:4000/auth/activate/${verificationKey}`;
  }

  // sendPasswordResetMail(recipient: string): void {
  //   setTimeout(async () => {
  //
  //     const code = this.generatePasswordResetCode(recipient)
  //
  //     await this.mailerService.sendMail({
  //       to: recipient,
  //       subject: 'Password Reset Code',
  //       text: `Your password reset code is: ${code}`,
  //       html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
  //     });
  //   });
  // }

  // async generatePasswordResetCode(recipient: string): Promise<string>{
  //
  //   const code = this.getRandomCode();
  //   const expirationTime = 2 * 60 * 1000 // 2 minutes
  //   const resetPasswordKey = crypto.createHash('sha256').update(code).digest('hex');
  //   const resetPasswordKey1 = crypto.createHash('sha256').update(code).digest('hex');
  //
  //   console.log(resetPasswordKey)
  //   console.log(resetPasswordKey1)
  //
  //   await this.cacheManager.set(
  //     `temp-reset-password-key__${resetPasswordKey}`,
  //     { recipient },
  //     expirationTime,
  //   );
  //   return code;
  // }

  getRandomCode(): string {
    let code = '';
    for (let i = 0; i < this.passwordCodeLength; i++) {
      const randomIndex = Math.floor(Math.random() * this.chars.length);
      code += this.chars[randomIndex];
    }
    return code;
  }

  // async generateResetPasswordCode(recipient: string): Promise<string> {
  //
  //   let code = '';
  //   for (let i = 0; i < this.passwordCodeLength; i++) {
  //     const randomIndex = Math.floor(Math.random() * this.chars.length);
  //     code += this.chars[randomIndex];
  //   }
  //
  //   const verificationKey = crypto.randomUUID();
  //   const expirationTime = 2 * 60 * 1000 // 2 minutes
  //
  //   await this.cacheManager.set(
  //     `temp-user-reset-password-key__${verificationKey}`,
  //     recipient,
  //     expirationTime,
  //   );
  //   return code;
  // }
}
