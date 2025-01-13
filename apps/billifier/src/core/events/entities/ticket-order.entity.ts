import { $Enums, TicketOrder } from '@prisma/client';
import { UserEntity } from '../../auth/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class TickerOrderEntity implements TicketOrder {
  @ApiProperty({ readOnly: true })
  id: string;
  @ApiProperty({ readOnly: true })
  amount: number;
  @ApiProperty({ readOnly: true })
  paymentReference: string;
  @ApiProperty({ readOnly: true, enum: $Enums.PaymentProvider })
  paymentProvider: $Enums.PaymentProvider;
  @ApiProperty({ readOnly: true, enum: $Enums.TicketOrderStatus })
  status: $Enums.TicketOrderStatus;
  @ApiProperty({ readOnly: true })
  buyerId: string;
  @ApiProperty({
    readOnly: true,
    type: PickType(UserEntity, ['email', 'name']),
  })
  buyer: Pick<UserEntity, 'email' | 'name'>;
  @ApiProperty({ readOnly: true })
  ticketId: string;
  @ApiProperty({ readOnly: true })
  quantity: number;

  @ApiProperty({ readOnly: true })
  createdAt: Date;
  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}
