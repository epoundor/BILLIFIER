import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../../../../order-queue/src/prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
