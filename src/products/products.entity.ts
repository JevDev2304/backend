 // src/products/entities/product.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Unique identifier for the product', example: 123 })
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Name of the product', example: 'Super Widget' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Detailed description of the product', example: 'A versatile widget for all your needs.' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 900000 })
  @Column({ type: 'bigint' })
  price: number;

  @ApiProperty({ description: 'Quantity available', example: 10 })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'URL to the product image', example: 'https://example.com/images/widget.jpg' })
  @Column()
  image: string;
}