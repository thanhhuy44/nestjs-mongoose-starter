import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsStrongPassword, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { EUserRole } from '@/types';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'John Updated' })
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'john.updated@example.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsEnum(EUserRole)
  @ApiPropertyOptional({ enum: EUserRole })
  role?: EUserRole;
}
