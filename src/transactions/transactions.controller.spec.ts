import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './transactions.dto';

const mockTransactionsService = {
  createTransaction: jest.fn(),
};

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call the service to create a transaction and return the result', async () => {
      const createDto: CreateTransactionDto = {
        quantityPurchased: 2,
        state: 'Pending',
        productId: 1,
        customer: { 
          fullname: 'John Doe', 
          email: 'customer@example.com' 
        },
        deliveryDetails: { 
          address: 'Calle 10 # 20-30', 
          city: 'Medellin' 
        },
        cardDetails: {
          number: '4242424242424242',
          cvc: '123',
          exp_month: '08',
          exp_year: '28',
          card_holder: 'John Doe',
          quotes: 1,
        },
        acceptance_token: 'acc_tok_12345',
        accept_personal_data: 'pd_tok_12345',
      };

      const mockResult = {
        success: true,
        message: 'Transaction created successfully',
        data: {
          id: '8',
          state: 'Approved',
          price: 6610000,
          email: 'customer@example.com',
          wompiId: '15113-1753055139-46665',
          status: 'APPROVED',
        },
      };

      mockTransactionsService.createTransaction.mockResolvedValue(mockResult);

      const result = await controller.createTransaction(createDto);

      expect(result).toEqual(mockResult);
      expect(service.createTransaction).toHaveBeenCalledWith(createDto);
    });
  });
});