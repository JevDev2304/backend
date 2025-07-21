import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({ description: 'City for the delivery', example: 'Medellin', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Full address for the delivery', example: 'Calle 10 # 20-30', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Postal code for the delivery', example: 50001, required: false })
  @IsOptional()
  @IsInt()
  postal_code?: number;
}