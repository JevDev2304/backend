import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Transaction } from 'src/transactions/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer,Transaction])],
})
export class CustomersModule {}
