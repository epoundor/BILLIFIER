import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketTemplateDto {
  @ApiProperty()
  ticketTemplateId: string;
}
