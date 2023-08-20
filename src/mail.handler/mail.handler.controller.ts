import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import {MailHandlerService} from "./mail.handler.service";

// add interface/class on data

@Controller()
export class MailHandlerController {

  // constructor(private mailHandlerService: MailHandlerService) {}

  @EventPattern('activation-mail')
  handleActivationMail(@Ctx() context: RmqContext) {
    const data = this.getData(context);
    console.log(data)
    // return this.mailHandlerService.sendActivationEmail(data, data)
  }

  @EventPattern('welcome-mail')
  handleWelcomeMail(@Ctx() context: RmqContext) {
    const data = this.getData(context);
    console.log(data)
    // return this.mailHandlerService.sendWelcomeEmail(data)
  }

  @EventPattern('password-reset-mail')
  HandleResetMail(@Ctx() context: RmqContext) {
    const data = this.getData(context);
    console.log(data)
    // return this.mailHandlerService.sendPasswordResetEmail(data, data)

  }

  getData(context: RmqContext) {
    return JSON.parse(context.getMessage().content.toString());
  }
}
