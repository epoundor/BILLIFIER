import { TicketOrder } from '@prisma/client';

export type SendTicketToBuyer = {
  email: string;
} & TicketOrder;
