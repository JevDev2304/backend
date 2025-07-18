import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// --- Entidades ---
// Importa TODAS tus entidades para la configuración global de TypeORM.
// Esto es CRÍTICO para que TypeORM las reconozca y pueda inyectar los repositorios.
import { Product } from './products/products.entity'; // Tu entidad Producto

// --- Módulos de Características ---
// Importa tus módulos ya refactorizados.
import { ProductsModule } from './products/products.module'; // ¡Tu módulo de productos encapsulado!

// --- Controladores Globales / de la Aplicación ---
// Mantén aquí solo los controladores que NO pertenecen a un módulo de característica específico.
import { AppController } from './app.controller';

// --- Servicios Globales / de la Aplicación ---
// Mantén aquí solo los servicios que NO pertenecen a un módulo de característica específico.
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        entities: [ // ¡Aquí deben ir TODAS tus entidades! 💡
          Product, // Asegúrate de que tu entidad 'Product' esté listada aquí.
          // Cuando crees Transaction, Delivery, Customer, etc., las añadirás aquí también.
        ],
        synchronize: false, // Mantén 'false' si tus entidades son espejos y gestionas las migraciones.
      }),
    }),
    // Módulos de características que ya has refactorizado:
    ProductsModule,
  ],
  controllers: [
    AppController,
    // Cuando crees el TransactionsModule, eliminarás TransactionsController de aquí.
  ],
  providers: [
    AppService,
    // Cuando crees el TransactionsModule, CustomersModule, etc., eliminarás sus servicios/repositorios de aquí.
  ],
})
export class AppModule {}