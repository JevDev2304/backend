import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;
  let typeormRepository: Repository<Product>;

  const mockProducts: Product[] = [
    { 
      id: 1, 
      name: 'Laptop', 
      description: 'A powerful laptop', 
      price: 1500, 
      quantity: 10,
      image: 'url/to/image.jpg',
      transactions: [],
    },
    { 
      id: 2, 
      name: 'Mouse', 
      description: 'A wireless mouse', 
      price: 50, 
      quantity: 100,
      image: 'url/to/image2.jpg',
      transactions: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue(mockProducts),
          },
        },
      ],
    }).compile();

    repository = module.get<ProductsRepository>(ProductsRepository);
    typeormRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll method', () => {
    it('should return an array of products', async () => {
      const result = await repository.findAll();

      expect(result).toEqual(mockProducts);
      expect(typeormRepository.find).toHaveBeenCalled();
    });
  });
});