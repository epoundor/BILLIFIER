import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '../../../../order-queue/src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReserveDto } from './dto';
import { CreateTicketDto } from '../tickets/dto';
import { ProducerService } from '../queue/producer.service';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private prisma: PrismaService,
    private producer: ProducerService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const hostId = this.request.user.sub;
    return await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        coverUrl: createEventDto.coverUrl,
        description: createEventDto.description,
        startingDate: createEventDto.startingDate,
        endingDate: createEventDto.endingDate,
        type: createEventDto.type,
        mapUrl: createEventDto.mapUrl,
        hostId,
      },
    });
  }

  async archive(id: string) {
    const hostId = this.request.user.sub;
    const findedEvent = await this.prisma.event.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const [_, event] = await this.prisma.$transaction([
      this.prisma.eventStatusHistory.create({
        data: {
          userId: hostId,
          eventId: id,
          status: findedEvent.status,
        },
      }),
      this.prisma.event.update({
        where: {
          id,
          hostId,
        },
        data: {
          status: 'ARCHIVED',
        },
      }),
    ]);

    return event;
  }

  async unacrhive(id: string) {
    try {
      const hostId = this.request.user.sub;

      // Check if the actual status is "ARCHIVED"
      await this.prisma.event.findUnique({
        where: {
          id,
          status: 'ARCHIVED',
        },
      });

      const { status: latestStatus } =
        await this.prisma.eventStatusHistory.findFirstOrThrow({
          where: {
            eventId: id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      if (latestStatus === 'ARCHIVED') throw new ForbiddenException();
      const [_, event] = await this.prisma.$transaction([
        this.prisma.eventStatusHistory.create({
          data: {
            userId: hostId,
            eventId: id,
            status: 'ARCHIVED',
          },
        }),
        this.prisma.event.update({
          where: {
            id,
            hostId,
          },
          data: {
            status: latestStatus,
          },
        }),
      ]);

      return event;
    } catch (error) {
      // TODO Refactor that
      this.logger.error(error);
      if (error instanceof ForbiddenException) throw new ForbiddenException();
      throw new InternalServerErrorException();
    }
  }

  async createTicket(id: string, createTicketDto: CreateTicketDto) {
    const hostId = this.request.user.sub;
    const event = await this.prisma.event.findUniqueOrThrow({
      where: {
        id,
        hostId,
      },
      select: { id: true },
    });

    const template = await this.prisma.ticketTemplate.findUnique({
      where: {
        id: createTicketDto.ticketTemplateId,
      },
    });

    if (!template) throw new NotFoundException('Template not found');

    return this.prisma.ticket.create({
      data: {
        capacity: createTicketDto.capacity,
        description: createTicketDto.description,
        title: createTicketDto.title,
        price: createTicketDto.price,
        total: 0,
        eventId: event.id,
        type: createTicketDto.type,
        ticketTemplateId: createTicketDto.ticketTemplateId,
      },
    });
  }

  async reserve(id: string, ticketId: string, dto: ReserveDto) {
    const buyerId = this.request.user.sub;
    const ticket = await this.prisma.ticket.findUniqueOrThrow({
      where: {
        id: ticketId,
        eventId: id,
      },
    });
    // Placed registration
    const order = await this.prisma.ticketOrder.create({
      data: {
        amount: dto.quantity * ticket.price,
        paymentProvider: dto.paymentProvider,
        status:
          dto.paymentProvider === 'CASH' || ticket.price === 0
            ? 'PAID'
            : 'INIT',
        ticketId,
        buyerId,
        quantity: dto.quantity,
      },
      include: {
        buyer: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // if (order.status === 'PAID') {
    //   const allTickets = [];
    //   for (let index = 0; index < order.quantity; index++) {
    //     allTickets.push({
    //       code: this.generateRandomCode(6),
    //       ticketId: order.ticketId,
    //       ticketOrderId: order.id,
    //       eventId: id,
    //     });
    //   }
    //   await this.prisma.userTicket.createMany({
    //     data: allTickets,
    //   });
    //   this.logger.log('Sending to queue');
    //   await this.producer.sendTicketToBuyer(order.buyer.email, order);
    // }

    return order;
  }

  /**
   * Génère un code alphanumérique aléatoire de la longueur spécifiée.
   * @param length - La longueur du code à générer.
   * @returns Une chaîne alphanumérique aléatoire.
   */
  private generateRandomCode(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
}
