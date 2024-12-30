import { PickType } from '@nestjs/swagger';
import { TicketEntity } from '../entities';

export class CreateTicketDto extends PickType(TicketEntity, [
  'title',
  'description',
  'type',
  'capacity',
  'ticketTemplateId',
  'price',
]) {}
