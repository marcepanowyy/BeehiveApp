import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ActivationMessage,
  PasswordResetMessage,
  PaymentConfirmationMessage,
  PaymentStatusEnum,
  WelcomeMessage,
} from './message';

@Injectable()
export class MessageHandlerService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(message: WelcomeMessage): Promise<void> {
    const { recipient } = message.data;

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

    console.log(`Welcoming mail has been sent to: ${recipient}`);
  }

  async sendActivationEmail(message: ActivationMessage): Promise<void> {
    const { recipient, activationCode } = message.data;

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

    console.log(`Activation mail has been sent to: ${recipient}`);
  }

  async sendPasswordResetEmail(message: PasswordResetMessage): Promise<void> {
    const { recipient, resetCode } = message.data;

    await this.mailerService.sendMail({
      to: recipient,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}\n\nPlease note that this code is valid for 10 minutes only.`,
      html: `
      <p>Your password reset code is: <strong>${resetCode}</strong></p>
      <p>Please note that this code is valid for 10 minutes only.</p>
    `,
    });

    console.log(`Password reset mail has been sent to: ${recipient}`);
  }

  async sendPaymentConfirmationMail(
    message: PaymentConfirmationMessage,
  ): Promise<void> {
    const { recipient, products, paymentStatus } = message.data;

    let statusMessage = '';
    let color = '';

    if (paymentStatus === PaymentStatusEnum.PAID) {
      statusMessage = 'Your payment has been successfully received.';
      color = 'green';
    } else if (paymentStatus === PaymentStatusEnum.AWAITING) {
      statusMessage = 'Your payment is awaiting processing.';
      color = 'blue';
    }

    const productListHtml = products
      .map(
        (product) => `
      <tr>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.currency} ${product.unitAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="3">
          <img src="${product.image}" alt="${product.name}" style="max-width: 100px; height: auto;">
        </td>
      </tr>
    `
      )
      .join('');

    const totalPrice = products.reduce(
      (total, product) => total + product.unitAmount * product.quantity,
      0
    );

    await this.mailerService.sendMail({
      to: recipient,
      subject: `Payment ${paymentStatus === PaymentStatusEnum.PAID ? 'Successful' : 'Pending'}`,
      text: `${statusMessage}\n\nProduct list:\n${products
        .map((product) => `${product.name} - ${product.quantity} x ${product.currency} ${(product.unitAmount / 100).toFixed(2)}`)
        .join('\n')}\n\nTotal: ${totalPrice}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <h2 style="color: #333;">Payment ${paymentStatus === PaymentStatusEnum.PAID ? 'Successful' : 'Pending'}</h2>
        <p style="color: #555;">Hello, ${recipient}!</p>
        <p style="color: #555;">${statusMessage}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${productListHtml}
          </tbody>
        </table>
        <p style="color: ${color}; font-weight: bold;">Total: ${totalPrice} ${products[0].currency}</p>
        <p style="color: #555;">Thank you for your purchase.</p>
        <p style="color: #555;">Best regards,</p>
        <p style="color: #555;">The Beehive Team</p>
      </div>
    `,
    });

    console.log(`Payment confirmation mail has been sent to: ${recipient}`);
  }




}
