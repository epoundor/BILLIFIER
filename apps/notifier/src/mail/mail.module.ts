import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get('SMTP_FROM'),
        },
        template: {
          dir: join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter(),

          options: {
            strict: true,
            inlineCssEnabled: true,
            /** See https://www.npmjs.com/package/inline-css#api */
            inlineCssOptions: {
              preserveMediaQueries: true,
            },
            removeStyleTags: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
