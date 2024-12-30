import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'order-queue',
        },
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class QueueModule {}
