import { Module } from '@nestjs/common';
import { MailHandlerController } from './mail.handler/mail.handler.controller';
// import { MailHandlerService } from './mail.handler/mail.handler.service';
import { MailHandlerModule } from './mail.handler/mail.handler.module';
// import { MailerModule } from '@nestjs-modules/mailer';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MailHandlerModule,

    // MailerModule.forRoot({
    //   transport: {
    //     host: process.env.EMAIL_HOST,
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   },
    // }),
    // ClientsModule.register([
    //   {
    //     name: 'MATH_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'],
    //       queue: 'mail-queue',
    //       queueOptions: {
    //         durable: false
    //       },
    //     },
    //   },
    // ]),

    // CacheModule.register({ isGlobal: true }),

  ],
  controllers: [MailHandlerController],
  // providers: [MailHandlerService],
})
export class AppModule {}
