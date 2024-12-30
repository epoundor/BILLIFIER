import {
  IsEnum,
  IsObject,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentAdapter } from '../payment.module';
import { ApiProperty } from '@nestjs/swagger';
import { KkiapayMetadata } from './kkiapay-metadata.dto';


// DTO principal
export class PayDto {
  @IsEnum(PaymentAdapter)
  @ApiProperty({ enum: PaymentAdapter })
  provider: PaymentAdapter;

  @ApiProperty()
  @ValidateIf((o) => o.provider === PaymentAdapter.KKIAPAY)
  @ValidateNested()
  @Type(() => KkiapayMetadata)
  @IsObject()
  metadata: KkiapayMetadata;

  //   @ValidateIf((o) => o.provider === PaymentAdapter.STRIPE)
  //   @ValidateNested()
  //   @Type(() => StripeMetadata)
  //   @IsObject()
  //   metadata: StripeMetadata;
}
