import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailHandlerService {
  constructor(private mailerService: MailerService) {}

  async sendActivationEmail(
    recipient: string,
    activationCode: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      subject: 'Activate Your Account',
      text: `Hello, ${recipient}!\n\nPlease use the following activation link to activate your account within 10 minutes: ${activationCode}\n\nThank you!\n\nThe Beehive Team`,
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <h2 style="color: #333;">Activate Your Account</h2>
      <p style="color: #555;">Hello, ${recipient}!</p>
      <p style="color: #555;">Please use the following activation link to activate your account within 10 minutes:</p>
      <p style="color: #555; font-size: 18px; padding: 10px; background-color: #ddd;">
        <a href="${activationCode}" style="text-decoration: none; color: #333;">Activate Account</a>
      </p>
      <p style="color: #555;">Activation is required to log in. If 10 minutes have passed, please register again.</p>
      <p style="color: #555;">Thank you for choosing Beehive</p>
      <p style="color: #555;">Best regards,</p>
      <p style="color: #555;">The Beehive Team</p>
    </div>
    `,
    });
  }

  async sendWelcomeEmail(recipient: string): Promise<void> {
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

  async sendPasswordResetEmail(
    recipient: string,
    resetCode: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}\n\nPlease note that this code is valid for 10 minutes only.`,
      html: `
      <p>Your password reset code is: <strong>${resetCode}</strong></p>
      <p>Please note that this code is valid for 10 minutes only.</p>
    `,
    });
  }
}