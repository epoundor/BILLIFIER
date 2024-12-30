import { NestFactory } from '@nestjs/core';
import { NotifierModule } from './notifier.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotifierModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost'],
        queue: 'notifier-queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );
  await app.listen();

  const logger = app.get(Logger);

  logger.log(`Notifier service module is up 🚀🚀🚀`);
}
bootstrap();
