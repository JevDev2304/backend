import { Test, TestingModule } from '@nestjs/testing';
import { WompiService } from './wompi.service';
import { TokenizeCardParams, CreateWompiTransactionParams, WompiTransactionData } from './wompi.interfaces';
import axios from 'axios';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

jest.mock('axios');
jest.mock('crypto');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiService', () => {
  let service: WompiService;
  let mockHttp: { post: jest.Mock; get: jest.Mock };

  beforeAll(() => {
    process.env.WOMPI_PUBLIC_KEY = 'test_pub_key';
    process.env.WOMPI_PRIVATE_KEY = 'test_prv_key';
    process.env.WOMPI_INTEGRATE_KEY = 'test_int_key';
  });

  beforeEach(async () => {
    mockHttp = {
      post: jest.fn(),
      get: jest.fn(),
    };
    mockedAxios.create.mockReturnValue(mockHttp as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [WompiService],
    })
      .setLogger(new Logger()) 
      .compile();

    service = module.get<WompiService>(WompiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tokenizeCard', () => {
    it('should return a card token on success', async () => {
      const mockToken = 'tok_test_12345';
      mockHttp.post.mockResolvedValue({ data: { data: { id: mockToken } } });

      const params: TokenizeCardParams = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'John Doe',
      };
      
      const token = await service.tokenizeCard(params);

      expect(token).toBe(mockToken);
      expect(mockHttp.post).toHaveBeenCalledWith('/tokens/cards', params, expect.any(Object));
    });
  });

  describe('createTransaction', () => {
    it('should generate signature and return transaction ID', async () => {
      const mockTxId = 'tx_test_12345';
      mockHttp.post.mockResolvedValue({ data: { data: { id: mockTxId } } });
      
      const mockUpdate = jest.fn().mockReturnThis();
      const mockDigest = jest.fn().mockReturnValue('mocked_signature');
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: mockDigest,
      });

      const params: Omit<CreateWompiTransactionParams, 'signature'> = {
        amount_in_cents: 10000,
        currency: 'COP',
        customer_email: 'test@example.com',
        reference: 'ref123',
        acceptance_token: 'acc_tok_test',
        accept_personal_auth: 'auth_pers_test',
        payment_method: { 
          type: 'CARD', 
          token: 'tok_test_123',
          installments: 1
        },
      };

      const txId = await service.createTransaction(params);
      
      expect(txId).toBe(mockTxId);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/transactions',
        expect.objectContaining({ signature: 'mocked_signature' }),
        expect.any(Object),
      );
    });
  });
  
  describe('generateSignature', () => {
    it('should generate a valid SHA256 signature', () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockDigest = jest.fn().mockReturnValue('final_hash');
      (crypto.createHash as jest.Mock).mockReturnValue({
        update: mockUpdate,
        digest: mockDigest,
      });

      const signature = service.generateSignature('ref123', 50000, 'COP');
      
      expect(signature).toBe('final_hash');
    });
  });

  describe('pollTransactionStatus', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
  
    afterEach(() => {
      jest.useRealTimers();
    });
  
    it('should return true when transaction is APPROVED', async () => {
      const pendingResponse: { data: { data: WompiTransactionData } } = { data: { data: { id: 'tx_1', status: 'PENDING' } } };
      const approvedResponse: { data: { data: WompiTransactionData } } = { data: { data: { id: 'tx_1', status: 'APPROVED' } } };

      mockHttp.get.mockResolvedValueOnce(pendingResponse).mockResolvedValueOnce(approvedResponse);
  
      const pollPromise = service.pollTransactionStatus({ transactionId: 'tx_1' });
  
      await jest.advanceTimersByTimeAsync(2001); 
      await jest.advanceTimersByTimeAsync(2001); 
  
      await expect(pollPromise).resolves.toBe(true);
    });
  
    it('should return false when transaction fails (e.g., DECLINED)', async () => {
      const pendingResponse: { data: { data: WompiTransactionData } } = { data: { data: { id: 'tx_2', status: 'PENDING' } } };
      const declinedResponse: { data: { data: WompiTransactionData } } = { data: { data: { id: 'tx_2', status: 'DECLINED' } } };

      mockHttp.get.mockResolvedValueOnce(pendingResponse).mockResolvedValueOnce(declinedResponse);
  
      const pollPromise = service.pollTransactionStatus({ transactionId: 'tx_2' });
  
      await jest.advanceTimersByTimeAsync(2001);
      await jest.advanceTimersByTimeAsync(2001);
  
      await expect(pollPromise).resolves.toBe(false);
    });
  
    it('should return false on polling timeout', async () => {
      const pendingResponse: { data: { data: WompiTransactionData } } = { data: { data: { id: 'tx_3', status: 'PENDING' } } };
      mockHttp.get.mockResolvedValue(pendingResponse);
  
      const pollPromise = service.pollTransactionStatus({ transactionId: 'tx_3' });
  
      await jest.advanceTimersByTimeAsync(60 * 1000 + 1);
  
      await expect(pollPromise).resolves.toBe(false);
    });
  });
});