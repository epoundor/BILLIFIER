import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Event } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class EventEntity implements Event {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty({ enum: $Enums.EventType })
  @IsEnum($Enums.EventType)
  @IsOptional()
  type: $Enums.EventType = 'LIVE';

  status: $Enums.EventStatus;

  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  coverUrl: string;
  @ApiProperty()
  @IsDateString()
  startingDate: Date;
  @ApiProperty()
  @IsDateString()
  endingDate: Date;

  @ApiProperty()
  @IsString()
  mapUrl: string;

  @ApiProperty({ readOnly: true })
  ticketCount: number;
  @ApiProperty({ readOnly: true })
  hostId: string;

  @ApiProperty({ readOnly: true })
  createdAt: Date;
  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}
