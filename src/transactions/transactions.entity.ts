import { Entity,  Column, ManyToOne, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/products.entity';
import { Customer } from '../customers/customer.entity';
import { Delivery } from '../deliveries/deliveries.entity';

@Entity('transactions')
export class Transaction {
  @ApiProperty({ description: 'Unique identifier for the transaction', example: 123 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => Product, description: 'Product related to this transaction' })
  @ManyToOne(() => Product, (product) => product.transactions)
  @JoinColumn({ name: 'product_id' })
  product: Product;


  @ApiProperty({ description: 'Quantity of items purchased', example: 2 })
  @Column()
  quantity_purchased: number;

  @ApiProperty({ description: 'Transaction State', example: 'Denied' })
  @Column()
  state: string;

  @ApiProperty({ description: 'Customer email', example: 'example@email.com' })
  @ManyToOne(() => Customer, customer => customer.transactions)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  customer: Customer;

  @ApiProperty({ description: 'Wompi identification', example: 'abc123xyz' })
  @Column()
  wompi_id: string;

  @OneToOne(() => Delivery, delivery => delivery.transaction)
  delivery: Delivery;


}