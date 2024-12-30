import type { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from 'apps/billifier/src/constants';

export function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Billifier API')
    .setDescription('The Billifier API documentation')
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN_KEY)
    // .addCookieAuth(REFRESH_TOKEN_KEY)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document, {
    customSiteTitle: 'Billifier API',
  });
}
