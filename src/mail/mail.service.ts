import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {
  }

  sendWelcomingMail(recipient: string): void {
    this.mailerService.sendMail({
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
    `
    });
  }

  sendActivationMail(recipient: string): void {

    const activationCode = this.generateActivationCode(); // Assuming you have a function to generate the activation code

    this.mailerService.sendMail({
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
    `
    });
  }

  private generateActivationCode(): string{

    const verificationKey = crypto.randomUUID()
    return `http://localhost:4000/auth/activate/${verificationKey}`

  }




}
