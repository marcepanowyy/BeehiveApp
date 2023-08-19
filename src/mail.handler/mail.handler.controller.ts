import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
// import {MailHandlerService} from "./mail.handler.service";

@Controller()
export class MailHandlerController {
  @EventPattern('test')
  getEventMessage(@Ctx() context: RmqContext) {
    console.log(
      JSON.parse(
        context.getMessage().content.toString(), // from buffer to string
      ),
    );
    const data = JSON.parse(context.getMessage().content.toString());
    const content = data.content;
  }
}
