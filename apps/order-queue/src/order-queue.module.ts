import { Logger, Module } from '@nestjs/common';
import { OrderQueueController } from './order-queue.controller';
import { OrderQueueService } from './order-queue.service';
import { TicketPdfService } from './ticket-pdf/ticket-pdf.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FileAdapter, FileModule } from '@billifier/file';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    FileModule.forRoot(FileAdapter.LOCAL, { uploadDir: './orders-ticket-pdfs' }),
  ],
  controllers: [OrderQueueController],
  providers: [OrderQueueService, Logger, TicketPdfService],
})
export class OrderQueueModule {}
