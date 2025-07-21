import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { Customer } from 'src/customers/customer.entity';
import { Delivery } from 'src/deliveries/deliveries.entity';
import { Product } from 'src/products/products.entity';
import { WompiModule } from 'src/wompi/wompi.module';

@Module({
    imports:[ TypeOrmModule.forFeature([Transaction,Customer, Delivery, Product]), WompiModule],
    controllers:[TransactionsController],
    providers:[TransactionsService,TransactionsRepository],
    exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {
    
}
