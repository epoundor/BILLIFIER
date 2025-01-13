import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetEventsDto } from './dto';
import { BasePaginationQueryDto } from '@billifier/types/dto';
import { PaginatedResponse } from '@billifier/types/types';
import { EventEntity } from './entities';
import { PER_PAGE } from './constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadEventService {
  constructor(private readonly prisma: PrismaService) {}

  private defaultInclude: Prisma.EventInclude = {
    host: true,
  };
  async findAll(query: GetEventsDto) {
    const condition: Prisma.EventWhereInput = {
      status: {
        not: 'ARCHIVED',
      },
    };

    return await this.paginateEventsResponse(condition, query);
  }

  async findOne(id: string) {
    const findedEvent = await this.prisma.event.findUnique({
      include: {
        tickets: true,
        host: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      where: {
        id,
        status: {
          not: 'ARCHIVED',
        },
      },
    });

    // TODO add a error message
    if (!findedEvent) throw new NotFoundException();
    return findedEvent;
  }

  async getTickets(id: string) {
    return this.prisma.ticket.findMany({
      where: {
        event: {
          status: {
            not: 'ARCHIVED',
          },
          id,
        },
      },
    });
  }

  async paginateEventsResponse<T extends BasePaginationQueryDto = GetEventsDto>(
    condition: Prisma.EventWhereInput,
    paginationOptions: T = {} as T,
    include: Prisma.EventInclude = this.defaultInclude,
    orderBy: Prisma.EventFindManyArgs['orderBy'] = [],
  ): Promise<PaginatedResponse<EventEntity>> {
    const prismaTake = paginationOptions.take ?? PER_PAGE;
    const prismaSkip = paginationOptions.page
      ? (paginationOptions.page - 1) * prismaTake
      : (paginationOptions.skip ?? 0);

    const paginationPayload: Pick<
      Prisma.EventFindManyArgs,
      'take' | 'skip' | 'orderBy'
    > = {
      take: prismaTake,
      skip: prismaSkip,
      orderBy: [
        ...(Array.isArray(orderBy) ? orderBy : [orderBy]),
        paginationOptions.sortBy && paginationOptions.sortOrder
          ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
          : {},
      ],
    };

    const [total, events] = await this.prisma.$transaction([
      this.prisma.event.count({ where: condition }),
      this.prisma.event.findMany({
        where: condition,
        ...paginationPayload,
        include: {
          ...this.defaultInclude,
          ...include,
        },
      }),
    ]);

    return {
      data: events,
      total,
    };
  }
}
