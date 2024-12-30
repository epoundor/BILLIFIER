import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class ReserveDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider;
}
