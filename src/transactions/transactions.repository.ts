import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/products.entity';
import { Transaction } from './transactions.entity';
import { Customer } from '../customers/customer.entity';
import { Delivery } from '../deliveries/deliveries.entity';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>
  ) {}

  async findProductById(productId: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id: productId } });
  }

  async saveProduct(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async findCustomerByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { email } });
  }

  createCustomer(customerData: Partial<Customer>): Customer {
    return this.customerRepository.create(customerData);
  }

  async saveCustomer(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }

  createTransaction(transactionData: Partial<Transaction>): Transaction {
    return this.transactionRepository.create(transactionData);
  }

  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  createDelivery(deliveryData: Partial<Delivery>): Delivery {
    return this.deliveryRepository.create(deliveryData);
  }

  async saveDelivery(delivery: Delivery): Promise<Delivery> {
    return await this.deliveryRepository.save(delivery);
  }
}
