// src/products/products.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('products') 
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' }) // Description for this specific endpoint
  @ApiResponse({ status: 200, description: 'List of all products successfully retrieved.', type: [Product] })
  async findAll(): Promise<Product[]> {
    return this.productsService.get_products();
  }
}