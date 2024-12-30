import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFIER_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'notifier-queue',
        },
      },
    ]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
