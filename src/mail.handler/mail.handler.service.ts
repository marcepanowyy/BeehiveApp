// import { Injectable} from '@nestjs/common';
// import {MailerService} from "@nestjs-modules/mailer";
//
// @Injectable()
// export class MailHandlerService {
//
//   constructor(
//     private mailerService: MailerService,
//   ) {}
//
//   async sendWelcomingMail(recipient: string): Promise<void> {
//     await this.mailerService.sendMail({
//       to: recipient,
//       subject: 'Welcome to Our Community!',
//       text: 'Welcome to our amazing community!',
//       html: `
//       <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
//         <h2 style="color: #333;">Welcome to Our Community!</h2>
//         <p style="color: #555;">Dear ${recipient},</p>
//         <p style="color: #555;">We are thrilled to have you as a new member of our community!</p>
//         <p style="color: #555;">Get ready for an exciting journey filled with learning and growth.</p>
//         <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to us.</p>
//         <p style="color: #555;">Thank you once again for joining us!</p>
//         <p style="color: #555;">Best regards,</p>
//         <p style="color: #555;">The Beehive Team</p>
//       </div>
//     `,
//     });
//   }
//
//
// }
