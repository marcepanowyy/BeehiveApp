import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    MailingService,
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
    },
  ],
  exports: [MailingService],
})
export class MailingModule {}
