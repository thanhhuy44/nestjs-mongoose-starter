import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return value;
  })
  @ApiProperty({ required: false, type: [String] })
  searchFields?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  dateFrom?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  dateTo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  dateField?: string; // vd: 'updatedAt' hoặc 'createdAt'

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fields?: string;

  // Với các filter động, để cho dễ, không validate chi tiết ở đây
  [key: string]: any;
}
