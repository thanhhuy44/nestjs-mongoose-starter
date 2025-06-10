import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateVNPLinkDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  orderId: string;
}
