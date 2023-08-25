import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { MessageHandlerService } from './message.handler.service';
import {
  ActivationMessage,
  PasswordResetMessage, PaymentConfirmationMessage,
  WelcomeMessage,
} from './message';

@Controller()
export class MessageHandlerController {
  constructor(private messageHandlerService: MessageHandlerService) {}

  @EventPattern('welcome-mail')
  handleWelcomeMail(@Ctx() context: RmqContext): Promise<void> {
    const message: WelcomeMessage = this.getData(context);
    console.log(`\nReceived message from the queue at ${this.currentTimestamp}, handling welcome mail...`);
    return this.messageHandlerService.sendWelcomeEmail(message);
  }

  @EventPattern('activation-mail')
  handleActivationMail(@Ctx() context: RmqContext) {
    const message: ActivationMessage = this.getData(context);
    console.log(`\nReceived message from the queue at ${this.currentTimestamp}, handling activation mail...`);
    return this.messageHandlerService.sendActivationEmail(message);
  }

  @EventPattern('password-reset-mail')
  handleResetMail(@Ctx() context: RmqContext) {
    const message: PasswordResetMessage = this.getData(context);
    console.log(`\nReceived message from the queue at ${this.currentTimestamp}, handling password reset mail...`);
    return this.messageHandlerService.sendPasswordResetEmail(message);
  }

  @EventPattern('payment-confirmation-mail')
  handlePaymentConfirmationMail(@Ctx() context: RmqContext) {
    const message: PaymentConfirmationMessage = this.getData(context);
    console.log(`\nReceived message from the queue at ${this.currentTimestamp}, handling payment confirmation mail...`);
    return this.messageHandlerService.sendPaymentConfirmationMail(message);
  }

  getData(context: RmqContext) {
    return JSON.parse(context.getMessage().content.toString());
  }

  get currentTimestamp(){
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
