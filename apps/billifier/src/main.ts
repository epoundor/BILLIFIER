import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupDocs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    bufferLogs: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  setupDocs(app);

  await app.listen(process.env.PORT);

  const logger = app.get(Logger);

  const appUrl = (await app.getUrl()).replace('[::1]', 'localhost');
  logger.log(`Server listening at ${appUrl}`);
}
bootstrap();
