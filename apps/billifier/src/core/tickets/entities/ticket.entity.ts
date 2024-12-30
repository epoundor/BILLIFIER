import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Ticket } from '@prisma/client';
import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TicketEntity implements Ticket {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiPropertyOptional({ enum: $Enums.TicketType })
  @IsOptional()
  @IsEnum($Enums.TicketType)
  type: $Enums.TicketType;
  @ApiProperty()
  @IsString()
  description: string;
  @IsString()
  @ApiProperty()
  title: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
  @ApiProperty()
  @Min(1)
  capacity: number;
  @ApiProperty({ readOnly: true })
  total: number;
  @ApiProperty()
  @IsString()
  ticketTemplateId: string;
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty({ readOnly: true })
  createdAt: Date;
  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}
