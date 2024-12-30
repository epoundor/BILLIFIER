import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../../../../order-queue/src/prisma/prisma.service';

@Injectable()
export class TicketService {
  private readonly logger: Logger = new Logger(TicketService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private prisma: PrismaService,
  ) {}

 
  async setTicketTemplate(id: string, ticketTemplateId: string) {
    const hostId = this.request.user.sub;
    const ticket = await this.prisma.ticket.update({
      where: {
        id,
        event: {
          hostId,
        },
      },
      data: {
        ticketTemplateId,
      },
    });
    return ticket;
  }
}
