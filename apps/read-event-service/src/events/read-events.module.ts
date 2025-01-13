import { Module } from '@nestjs/common';
import { ReadEventService } from './read-event.service';
import { ReadEventServiceController } from './read-event.controller';

@Module({
  controllers: [ReadEventServiceController],
  providers: [ReadEventService],
})
export class EventsModule {}
