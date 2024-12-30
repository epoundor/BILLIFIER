import { Controller, Patch, Param, Body } from '@nestjs/common';
import { TicketOrdersService } from './ticket-orders.service';
import { ApiCookieAuth } from '@nestjs/swagger';
import { PayDto } from './payment/dto';

@Controller('ticket-orders')
@ApiCookieAuth()
export class TicketOrdersController {
  constructor(private readonly ticketOrdersService: TicketOrdersService) {}

  @Patch(':id/pay')
  update(@Param('id') id: string, @Body() pld: PayDto) {
    return this.ticketOrdersService.payTicketOrder(id, pld);
  }
}
