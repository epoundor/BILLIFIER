import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../../../order-queue/src/prisma/prisma.module';
import { TokenModule } from '../token/token.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
