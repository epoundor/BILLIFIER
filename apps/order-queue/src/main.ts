import { NestFactory } from '@nestjs/core';
import { OrderQueueModule } from './order-queue.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderQueueModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost'],
        queue: 'order-queue',
      },
    },
  );
  await app.listen();

  const logger = app.get(Logger);

  logger.log(`Order queue module is up 🚀🚀🚀`);
}
bootstrap();
