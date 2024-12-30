import { PickType } from '@nestjs/swagger';
import { TemplateEntity, TicketEntity } from '../entities';

export class CreateTemplateDto extends PickType(TemplateEntity, [
  "backgroundImage",
  "metadata",
  "name",
  "qrCodeSetting",
]) {}
