import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '../../../../order-queue/src/prisma/prisma.service';
import { CreateTemplateDto } from './dto';
import { Request } from 'express';

@Injectable()
export class TemplateService {
  private readonly logger: Logger = new Logger(TemplateService.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private prisma: PrismaService,
  ) {}

  create(dto: CreateTemplateDto) {
    const userId = this.request.user.sub;

    if (dto.qrCodeSetting && dto.qrCodeSetting.length !== 4)
      throw new BadRequestException({
        message: ["qrCodeSetting's length should be 4"],
      });
    if (
      dto.qrCodeSetting &&
      !dto.qrCodeSetting.every((el) => Number.parseFloat(String(el)))
    )
      throw new BadRequestException({
        message: ['qrCodeSetting must be a array of number'],
      });

    return this.prisma.ticketTemplate.create({
      data: {
        name: dto.name,
        backgroundImage: dto.backgroundImage,
        qrCodeSetting: dto.qrCodeSetting ?? [0, 0, 0, 0],
        metadata: dto.metadata,
        userId,
      },
    });
  }
}
