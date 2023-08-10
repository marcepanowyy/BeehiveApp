import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {

  constructor(private mailService: MailService) {
  }

  // @Get('welcoming')
  // sendWelcomingMail(){
  //   return this.mailService.sendWelcomingMail('psyduck281@gmail.com')
  // }
  //
  // @Get('activating')
  // sendActivatingMail(){
  //   return this.mailService.sendActivatingMail('psyduck281@gmail.com')
  // }

}
