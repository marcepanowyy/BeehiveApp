import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { MessageHandlerService } from './message.handler.service';
import {
  ActivationMessage,
  PasswordResetMessage,
  WelcomeMessage,
} from './message';

@Controller()
export class MessageHandlerController {
  constructor(private messageHandlerService: MessageHandlerService) {}

  @EventPattern('welcome-mail')
  handleWelcomeMail(@Ctx() context: RmqContext): Promise<void> {
    const message: WelcomeMessage = this.getData(context);
    console.log('Got message from the queue, handling welcome mail...');
    return this.messageHandlerService.sendWelcomeEmail(message);
  }

  @EventPattern('activation-mail')
  handleActivationMail(@Ctx() context: RmqContext) {
    const message: ActivationMessage = this.getData(context);
    console.log('Got message from the queue, handling activation mail...');
    return this.messageHandlerService.sendActivationEmail(message);
  }

  @EventPattern('password-reset-mail')
  HandleResetMail(@Ctx() context: RmqContext) {
    const message: PasswordResetMessage = this.getData(context);
    console.log('Got message from the queue, handling password reset mail...');
    return this.messageHandlerService.sendPasswordResetEmail(message);
  }

  getData(context: RmqContext) {
    return JSON.parse(context.getMessage().content.toString());
  }
}
