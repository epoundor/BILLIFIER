import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'apps/order-queue/src/prisma/prisma.service';
import { Request } from 'express';
import { MESSAGE } from '../../constants';
import { PaymentService } from './payment/payment.service';
import { PayDto } from './payment/dto';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class TicketOrdersService {
  private readonly logger: Logger = new Logger(TicketOrdersService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private paymentService: PaymentService,
    private prisma: PrismaService,
  ) {}

  async payTicketOrder(ticketOrderId: string, pld: PayDto) {
    const payerId = this.request.user.sub;
    const ticketOrder = await this.prisma.ticketOrder.findUnique({
      where: {
        id: ticketOrderId,
        buyerId: payerId,
      },
      select: {
        id: true,
        status: true,
        amount: true,
        ticket: {
          select: {
            id:true,
            title: true,
            description: true,
            event: {
              select: {
                id: true,
                coverUrl: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Payment of Ticket#${ticketOrder.id}`);
    if (ticketOrder.status !== 'INIT')
      throw new ForbiddenException(MESSAGE.PAYMENT_ALREADY_PROCESSED);

    const paymentUrl = await this.paymentService.pay(
      pld.provider,
      ticketOrder.amount,
      {
        ...pld.metadata,
        name: ticketOrder.ticket.title,
        description: ticketOrder.ticket.description,
        logo: ticketOrder.ticket.event.coverUrl,
        state: {
          ticketOrderId: ticketOrder.id,
          ticketId: ticketOrderId,
        },
      },
    );

    return this.prisma.payment.create({
      data: {
        amount: ticketOrder.amount,
        provider: pld.provider as PaymentProvider,
        status: 'PENDING',
        eventId: ticketOrder.ticket.event.id,
        ticketId: ticketOrder.ticket.id,
        payerId,
        url: paymentUrl,
      },
    });
  }
}
