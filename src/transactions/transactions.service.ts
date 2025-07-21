import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from './transactions.dto';
import { WompiService } from '../wompi/wompi.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly wompiService: WompiService
  ) {}

  async createTransaction(
    dto: CreateTransactionDto
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      id: number;
      state: string;
      price: number;
      email: string;
      wompiId: string;
      status: string;
    };
  }> {
    try {
      const product = await this.transactionsRepository.findProductById(dto.productId);
      if (!product) {
        throw new NotFoundException(`Product with id ${dto.productId} not found`);
      }

      // Buscar o crear cliente
      let customer = await this.transactionsRepository.findCustomerByEmail(dto.customer.email);
      if (customer) {
        customer.fullname = dto.customer.fullname;
      } else {
        customer = this.transactionsRepository.createCustomer(dto.customer);
      }
      customer = await this.transactionsRepository.saveCustomer(customer);

      // Calcular precio
      const delivery_price = 10000;
      const price = Number(product.price) * dto.quantityPurchased + delivery_price;

      // Tokenizar tarjeta
      let tokenize_card: string;
      try {
        tokenize_card = await this.wompiService.tokenizeCard({
          number: dto.cardDetails.number,
          cvc: dto.cardDetails.cvc,
          exp_month: dto.cardDetails.exp_month,
          exp_year: dto.cardDetails.exp_year,
          card_holder: dto.cardDetails.card_holder
        });
      } catch {
        throw new BadRequestException('Failed to tokenize card. Please verify your card details.');
      }

      // Crear transacción en Wompi
      const reference = `TX-${Date.now()}`;
      let wompi_transaction_id: string;
      try {
        wompi_transaction_id = await this.wompiService.createTransaction({
          acceptance_token: dto.acceptance_token,
          accept_personal_auth: dto.accept_personal_data,
          amount_in_cents: price * 100,
          currency: 'COP',
          customer_email: customer.email,
          reference,
          payment_method: {
            type: 'CARD',
            token: tokenize_card,
            installments: dto.cardDetails.quotes
          }
        });
      } catch {
        throw new BadRequestException('Failed to create transaction in Wompi. Please try again.');
      }

      // Crear transacción en base de datos
      let transaction = this.transactionsRepository.createTransaction({
        quantity_purchased: dto.quantityPurchased,
        state: 'PENDING',
        wompi_id: wompi_transaction_id,
        product,
        customer
      });
      transaction = await this.transactionsRepository.saveTransaction(transaction);

      // Crear entrega
      const delivery = this.transactionsRepository.createDelivery({
        ...dto.deliveryDetails,
        transaction
      });
      await this.transactionsRepository.saveDelivery(delivery);

      // Verificar estado de la transacción
      let wompiStatus: string;
      try {
        const status = await this.wompiService.pollTransactionStatus({
          transactionId: wompi_transaction_id
        });
        wompiStatus = status ? 'APPROVED' : 'DENIED';
      } catch {
        wompiStatus = 'UNKNOWN';
      }

      // Actualizar estado de la transacción y stock del producto
      if (wompiStatus === 'APPROVED') {
        transaction.state = 'Approved';
        product.quantity = product.quantity - dto.quantityPurchased;
        await this.transactionsRepository.saveProduct(product);
      } else {
        transaction.state = 'Denied';
        await this.transactionsRepository.saveTransaction(transaction);
        throw new BadRequestException('The transaction was denied by Wompi. Please try with another credit card.');
      }
      return {
        success: true,
        message: 'Transaction created successfully',
        data: {
          id: transaction.id,
          state: transaction.state,
          price,
          email: customer.email,
          wompiId: transaction.wompi_id,
          status: wompiStatus
        }
      };
    } catch (error) {
      console.error('Transaction Error:', error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return { success: false, message: error.message };
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while processing the transaction.'
      );
    }
  }
}
