import { PartialType } from '@nestjs/swagger';
import { CreateTicketOrderDto } from './create-ticket-order.dto';

export class UpdateTicketOrderDto extends PartialType(CreateTicketOrderDto) {}
