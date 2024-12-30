import { PickType } from '@nestjs/swagger';
import { EventEntity } from '../entities';

export class CreateEventDto extends PickType(EventEntity, [
  'title',
  'description',
  'type',
  'coverUrl',
  'startingDate',
  'endingDate',
  'mapUrl',
]) {}
