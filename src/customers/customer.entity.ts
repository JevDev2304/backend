import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transactions/transactions.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({ description: 'Customer email (primary key)', example: 'example@email.com' })
  @PrimaryColumn({ type: 'varchar' })
  email: string;

  @ApiProperty({ description: 'Full name of the customer', example: 'John Doe' })
  @Column({ name: 'full_name' })
  fullname: string;

  @OneToMany(() => Transaction, transaction => transaction.customer)
  transactions: Transaction[];
}