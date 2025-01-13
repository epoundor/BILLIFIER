import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/read-events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  providers: [Logger],
})
export class ReadEventServiceModule {}
