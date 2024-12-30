import { TicketOrder } from '@prisma/client';

export class OrderBookedDto {
  email: string;
  order: TicketOrder & {
    buyer: {
      email: 'freedausstanda@gmail.com';
      name: 'epoundor';
    };
  };
}
