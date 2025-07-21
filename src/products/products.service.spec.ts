import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity';

const mockProductsRepository = {
  findAll: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get_products', () => {
    it('should call the repository findAll method and return its result', async () => {
      const mockResult: Product[] = [
        {
          id: 1,
          name: 'Test Service Product',
          description: 'A test product from service',
          price: 100,
          quantity: 10,
          image: 'test.jpg',
          transactions: [],
        },
      ];
      
      mockProductsRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.get_products();

      expect(result).toEqual(mockResult);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });
});