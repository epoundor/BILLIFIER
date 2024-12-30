import { Logger, Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      // validate: validate,
      envFilePath: ['.env.development', '.env.staging', '.env.production'],
    }),
  ],
  providers: [Logger],
})
export class NotifierModule {}
