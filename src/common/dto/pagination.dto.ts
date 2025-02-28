import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

import { ESortDirection } from '@/types';

export class PaginationDto {
  @ApiProperty({
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(10)
  limit?: number;

  @ApiProperty({
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    default: ESortDirection.DESC,
    enum: ESortDirection,
  })
  @IsOptional()
  @IsEnum(ESortDirection)
  sortDirection?: SortOrder;
}
