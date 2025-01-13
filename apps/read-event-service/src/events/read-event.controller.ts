import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetEventsDto } from './dto';
import { ReadEventService } from './read-event.service';
import { EventEntity } from './entities';

@ApiTags('Events')
@ApiCookieAuth()
@Controller('events')
export class ReadEventServiceController {
  constructor(private readonly eventsService: ReadEventService) {}

  @Get()
  findAll(@Query() query: GetEventsDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOkResponse({ type: EventEntity })
  @Get(':id/tickets')
  getEventTicket(@Param('id') id: string) {
    return this.eventsService.getTickets(id);
  }
}
