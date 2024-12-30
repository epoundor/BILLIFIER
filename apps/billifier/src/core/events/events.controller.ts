import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, SkipAuth } from '../../../src/decorators';
import { EventEntity } from './entities';
import { CreateEventDto, GetEventsDto, ReserveDto } from './dto';
import { TicketEntity } from '../tickets/entities';
import { CreateTicketDto } from '../tickets/dto';

@ApiTags('Events')
@ApiCookieAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOkResponse({ type: EventEntity })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @SkipAuth()
  @Get()
  findAll(@Query() query: GetEventsDto) {
    return this.eventsService.findAll(query);
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.eventsService.archive(id);
  }
  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.eventsService.unacrhive(id);
  }

  // Tickets
  @Post(':id/tickets')
  @ApiOkResponse({ type: TicketEntity })
  createEventTicket(
    @Body() createTicketDto: CreateTicketDto,
    @Param('id') id: string,
  ) {
    return this.eventsService.createTicket(id, createTicketDto);
  }

  @Post(':id/tickets/:ticketId/reserve')
  // @ApiOkResponse({ type: TicketEntity })
  reserve(
    @Body() reserveDto: ReserveDto,
    @Param('id') id: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.eventsService.reserve(id, ticketId, reserveDto);
  }

  @Get(':id/tickets')
  @SkipAuth()
  @ApiOkResponse({ type: EventEntity })
  getEventTicket(@Param('id') id: string) {
    return this.eventsService.getTickets(id);
  }
}
