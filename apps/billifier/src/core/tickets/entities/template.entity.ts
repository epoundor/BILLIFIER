import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketTemplate } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsArray, IsObject, IsString } from 'class-validator';

export class TemplateEntity implements TicketTemplate {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @ApiPropertyOptional()
  backgroundImage: string | undefined;
  @ApiPropertyOptional()
  @IsArray()
  qrCodeSetting: number[] | undefined;
  @ApiPropertyOptional()
  @IsObject()
  metadata: JsonValue | undefined;
  @ApiProperty({ readOnly: true })
  userId: string;

  @ApiProperty({ readOnly: true })
  createdAt: Date;
  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}
