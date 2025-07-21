import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { WompiService } from '../wompi/wompi.service';
import { CreateTransactionDto } from './transactions.dto';
import { Product } from '../products/products.entity';
import { Customer } from '../customers/customer.entity';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Transaction } from './transactions.entity';

const mockTransactionsRepository = {
  findProductById: jest.fn(),
  saveProduct: jest.fn(),
  findCustomerByEmail: jest.fn(),
  createCustomer: jest.fn(),
  saveCustomer: jest.fn(),
  createTransaction: jest.fn(),
  saveTransaction: jest.fn(),
  createDelivery: jest.fn(),
  saveDelivery: jest.fn(),
};

const mockWompiService = {
  tokenizeCard: jest.fn(),
  createTransaction: jest.fn(),
  pollTransactionStatus: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionsRepository;
  let wompi: WompiService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 150000,
    quantity: 10,
    description: '',
    image: '',
    transactions: [],
  };

  const mockCustomer: Customer = {
    email: 'test@example.com',
    fullname: 'John Doe',
    transactions: [],
  };
  
  const mockDto: CreateTransactionDto = {
    productId: 1,
    quantityPurchased: 2,
    state: 'PENDING',
    customer: { fullname: 'John Doe', email: 'test@example.com' },
    deliveryDetails: { city: 'Medellin', address: '123 Test St' },
    cardDetails: { number: '4242...', cvc: '123', exp_month: '12', exp_year: '25', card_holder: 'John Doe', quotes: 1 },
    acceptance_token: 'acc_tok_test',
    accept_personal_data: 'pd_tok_test'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionsRepository, useValue: mockTransactionsRepository },
        { provide: WompiService, useValue: mockWompiService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionsRepository>(TransactionsRepository);
    wompi = module.get<WompiService>(WompiService);

    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    
    it('should create a transaction successfully (happy path)', async () => {
      (repository.findProductById as jest.Mock).mockResolvedValue({ ...mockProduct });
      (repository.findCustomerByEmail as jest.Mock).mockResolvedValue(null);
      (repository.createCustomer as jest.Mock).mockReturnValue(mockCustomer);
      (repository.saveCustomer as jest.Mock).mockResolvedValue(mockCustomer);
      (wompi.tokenizeCard as jest.Mock).mockResolvedValue('card_token_123');
      (wompi.createTransaction as jest.Mock).mockResolvedValue('wompi_tx_123');
      const mockDbTransaction = { id: 1, state: 'PENDING', wompi_id: 'wompi_tx_123' } as Transaction;
      (repository.createTransaction as jest.Mock).mockReturnValue(mockDbTransaction);
      (repository.saveTransaction as jest.Mock).mockResolvedValue(mockDbTransaction);
      (wompi.pollTransactionStatus as jest.Mock).mockResolvedValue(true); 

      const result = await service.createTransaction(mockDto);
      
      expect(result.success).toBe(true);
      expect(result.data!.status).toBe('APPROVED');
      expect(repository.saveProduct).toHaveBeenCalledWith(expect.objectContaining({ quantity: 8 }));
    });

    it('should throw NotFoundException if product does not exist', async () => {
      (repository.findProductById as jest.Mock).mockResolvedValue(null);

      const result = await service.createTransaction(mockDto);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Product with id 1 not found');
    });

    it('should throw BadRequestException if card tokenization fails', async () => {
      (repository.findProductById as jest.Mock).mockResolvedValue(mockProduct);
      (repository.findCustomerByEmail as jest.Mock).mockResolvedValue(mockCustomer);
      (wompi.tokenizeCard as jest.Mock).mockRejectedValue(new Error());

      const result = await service.createTransaction(mockDto);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to tokenize card. Please verify your card details.');
    });



    it('should throw BadRequestException if Wompi transaction creation fails', async () => {
      (repository.findProductById as jest.Mock).mockResolvedValue(mockProduct);
      (wompi.tokenizeCard as jest.Mock).mockResolvedValue('card_token_123');
      (wompi.createTransaction as jest.Mock).mockRejectedValue(new Error());

      const result = await service.createTransaction(mockDto);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create transaction in Wompi. Please try again.');
    });

    it('should throw BadRequestException if transaction is denied by Wompi', async () => {
      (repository.findProductById as jest.Mock).mockResolvedValue({ ...mockProduct });
      (repository.findCustomerByEmail as jest.Mock).mockResolvedValue(mockCustomer);
      (wompi.tokenizeCard as jest.Mock).mockResolvedValue('card_token_123');
      (wompi.createTransaction as jest.Mock).mockResolvedValue('wompi_tx_123');
      const mockDbTransaction = { id: 1, state: 'PENDING' } as Transaction;
      (repository.createTransaction as jest.Mock).mockReturnValue(mockDbTransaction);
      (repository.saveTransaction as jest.Mock).mockResolvedValue(mockDbTransaction);
      (wompi.pollTransactionStatus as jest.Mock).mockResolvedValue(false);

      const result = await service.createTransaction(mockDto);

      expect(result.success).toBe(false);
      expect(result.message).toBe('The transaction was denied by Wompi. Please try with another credit card.');
      expect(repository.saveProduct).not.toHaveBeenCalled();
      expect(repository.saveTransaction).toHaveBeenCalledWith(expect.objectContaining({ state: 'Denied' }));
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      (repository.findProductById as jest.Mock).mockRejectedValue(new Error('Unexpected DB Error'));

      await expect(service.createTransaction(mockDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});