// src/transactions/transactions.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDeliveryDto } from '../deliveries/deliveries.dto';
import { CreateCustomerDto } from '../customers/customers.dto';
import { CardDto } from './card.dto';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Quantity of items purchased', example: 2 })
  @IsInt()
  quantityPurchased: number;

  @ApiProperty({ description: 'Transaction State', example: 'Pending' })
  @IsString()
  state: string;
  
  @ApiProperty({ description: 'ID of the product for this transaction', example: 1 })
  @IsInt()
  productId: number; 

  @ApiProperty({ description: 'Customer details for this transaction' })
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;

  @ApiProperty({ description: 'Delivery details for this transaction' })
  @ValidateNested()
  @Type(() => CreateDeliveryDto)
  deliveryDetails: CreateDeliveryDto;

  @ApiProperty({ description: 'Card details for payment' })
  @ValidateNested()
  @Type(() => CardDto)
  cardDetails: CardDto;

  @ApiProperty({ description: 'Acceptance token from frontend', example: 'acc_tok_12345' })
  @IsString()
  acceptance_token: string;

  @ApiProperty({ description: 'Personal data acceptance token from frontend', example: 'personal_data_tok_12345' })
  @IsString()
  accept_personal_data: string;
}
