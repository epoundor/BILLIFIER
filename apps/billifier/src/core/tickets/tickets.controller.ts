import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './tickets.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TemplateEntity, TicketEntity } from './entities';
import { UpdateTicketTemplateDto } from './dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateService } from './template.service';

@ApiTags("Tickets")
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly templateService: TemplateService,
  ) {}

  @Patch(':id/template')
  @ApiOkResponse({ type: TicketEntity })
  update(@Param('id') id: string, @Body() dto: UpdateTicketTemplateDto) {
    return this.ticketService.setTicketTemplate(id, dto.ticketTemplateId);
  }

  @Post('template')
  @ApiOkResponse({ type: TemplateEntity })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }
}
