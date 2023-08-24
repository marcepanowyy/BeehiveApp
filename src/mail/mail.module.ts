import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  controllers: [MailController],
  providers: [MailService,

    {
      provide: 'MAIL_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'mail-queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    }


  ],
  exports: [MailService],
})
export class MailModule {}
