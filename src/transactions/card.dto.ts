import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsCreditCard, Length, Matches, IsInt, Min, Max } from 'class-validator';

export class CardDto {
  @ApiProperty({ description: 'Card number', example: '4242424242424242' })
  @IsCreditCard()
  number: string;

  @ApiProperty({ description: 'Security code (CVC)', example: '123' })
  @IsString()
  @Matches(/^[0-9]{3,4}$/, { message: 'CVC must have 3 or 4 numeric digits' })
  cvc: string;

  @ApiProperty({ description: 'Expiration month (2 digits)', example: '08' })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Expiration month must be between 01 and 12' })
  exp_month: string;

  @ApiProperty({ description: 'Expiration year (2 digits)', example: '28' })
  @IsString()
  @Matches(/^[0-9]{2}$/, { message: 'Expiration year must be 2 digits' })
  exp_year: string;

  @ApiProperty({ description: 'Cardholder name', example: 'John Doe' })
  @IsString()
  @Length(2, 100, { message: 'The name must be between 2 and 100 characters long' })
  card_holder: string;

  @ApiProperty({ description: 'Number of quotes or installments', example: 3 })
  @IsInt({ message: 'Quotes must be an integer value' })
  @Min(1, { message: 'Quotes must be at least 1' })
  @Max(36, { message: 'Quotes cannot exceed 36' })
  quotes: number;
}
