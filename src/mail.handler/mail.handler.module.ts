import { Module } from '@nestjs/common';
import { MailHandlerController } from './mail.handler.controller';
import { MailHandlerService } from './mail.handler.service';

@Module({

  // controllers: [MailHandlerController],
  // providers: [MailHandlerService],

})
export class MailHandlerModule {}
