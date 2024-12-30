import { Module } from '@nestjs/common';
import { TicketOrdersService } from './ticket-orders.service';
import { TicketOrdersController } from './ticket-orders.controller';
import { PaymentService } from './payment/payment.service';

@Module({
  // imports: [PaymentModule],
  controllers: [TicketOrdersController],
  providers: [TicketOrdersService, PaymentService],
})
export class TicketOrdersModule {}
