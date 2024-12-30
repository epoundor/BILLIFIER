import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { PrismaModule } from '../../order-queue/src/prisma/prisma.module';
import { MailModule } from './core/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './core/token/token.module';
import { EventsModule } from './core/events/events.module';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './guards';
import { APP_GUARD } from '@nestjs/core';
import { TicketModule } from './core/tickets/tickets.module';
import { QueueModule } from './core/queue/queue.module';
import { TicketOrdersModule } from './core/ticket-orders/ticket-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      // validate: validate,
      envFilePath: ['.env.development', '.env.staging', '.env.production'],
    }),
    AuthModule,
    PrismaModule,
    MailModule,
    TokenModule,
    EventsModule,
    TicketModule,
    QueueModule,
    TicketOrdersModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
