import { NestFactory } from '@nestjs/core';
import { ReadEventServiceModule } from './read-event-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ReadEventServiceModule);

  const config = new DocumentBuilder()
    .setTitle('Billifier API')
    .setDescription('Billifier Read Event Service documentation')
    .setVersion('1.0')
    .build();

  const logger = app.get(Logger);

  if (process.env.NODE_ENV === 'dev') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document, {
      customSiteTitle: 'Billifier Read Event Service',
    });
  }

  await app.listen(process.env.READ_EVENT_SERVICE_PORT ?? 3001);

  const appUrl = (await app.getUrl()).replace('[::1]', 'localhost');
  logger.log(`Notifier service module is up 🚀🚀🚀`);
  logger.log(`Server listening at ${appUrl}`);
  if (process.env.NODE_ENV === 'dev') {
    logger.log(`Docs is available on ${appUrl}/documentation`);
  }
}
bootstrap();
