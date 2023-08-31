import { Module } from '@nestjs/common';
import { MessageHandlerService } from './message.handler.service';
import { MessageHandlerController } from './message.handler.controller';

import 'dotenv/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [MessageHandlerService],
  controllers: [MessageHandlerController],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
  ],
})
export class MessageHandlerModule {}
