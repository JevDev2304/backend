import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // <-- ¡Importante! Registra la entidad para este módulo
  ],
  controllers: [ProductsController], // El controlador de productos ahora vive aquí
  providers: [ProductsService, ProductsRepository], // El servicio y repositorio de productos ahora viven aquí
  exports: [ProductsService, ProductsRepository], // Opcional: exporta si otros módulos necesitan usar estos proveedores
})
export class ProductsModule {}