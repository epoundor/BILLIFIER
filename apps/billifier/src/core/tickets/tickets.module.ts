import { Module } from '@nestjs/common';
import { TicketService } from './tickets.service';
import { TicketController } from './tickets.controller';
import { TemplateService } from './template.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService, TemplateService],
})
export class TicketModule {}
