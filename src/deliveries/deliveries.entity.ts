import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transactions/transactions.entity';

@Entity('deliveries')
export class Delivery {
  @ApiProperty({ description: 'Unique identifier for the delivery, which is also the transaction ID', example: 123 })
  @PrimaryColumn({ type: 'bigint', name: 'id_transaction' }) // Maps to id_transaction in the DB
  id: number; // Use 'id' for the property name in TypeScript for consistency

  @ApiProperty({ description: 'City for the delivery', example: 'Medellin' })
  @Column({ type: 'character varying', nullable: true }) // Assuming it can be null based on CREATE TABLE
  city: string;

  @ApiProperty({ description: 'Full address for the delivery', example: 'Calle 10 # 20-30' })
  @Column({ type: 'character varying', nullable: true }) // Assuming it can be null
  address: string;

  @ApiProperty({ description: 'Postal code for the delivery', example: 50001 })
  @Column({ type: 'integer', nullable: true }) // Assuming it can be null
  postal_code: number;

  @OneToOne(() => Transaction, transaction => transaction.delivery)
  @JoinColumn({ name: 'id_transaction', referencedColumnName: 'id' }) 
  transaction: Transaction;
}