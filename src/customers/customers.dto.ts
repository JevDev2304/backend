// src/customers/customers.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer email', example: 'customer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Full name of the customer', example: 'John Doe' })
  @IsString()
  fullname: string;
}
