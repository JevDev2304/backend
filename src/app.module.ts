  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { ConfigModule, ConfigService } from '@nestjs/config';


  import { Product } from './products/products.entity';

  import { ProductsModule } from './products/products.module'; 

  import { AppController } from './app.controller';


  import { AppService } from './app.service';
  import { TransactionsController } from './transactions/transactions.controller';
  import { TransactionsService } from './transactions/transactions.service';
  import { CustomersModule } from './customers/customers.module';
  import { DeliveriesModule } from './deliveries/deliveries.module';
  import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transactions.entity';
import { Delivery } from './deliveries/deliveries.entity';
import { Customer } from './customers/customer.entity';
import { WompiModule } from './wompi/wompi.module';

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
            Transaction,
            Delivery,
            Customer
          ],
          synchronize: false, // Mantén 'false' si tus entidades son espejos y gestionas las migraciones.
        }),
      }),
      // Módulos de características que ya has refactorizado:
      ProductsModule,
      CustomersModule,
      DeliveriesModule,
      TransactionsModule,
      WompiModule
    ],
    controllers: [
      AppController,
      TransactionsController,
      // Cuando crees el TransactionsModule, eliminarás TransactionsController de aquí.
    ],
    providers: [
      AppService,
      TransactionsService,
      // Cuando crees el TransactionsModule, CustomersModule, etc., eliminarás sus servicios/repositorios de aquí.
    ],
  })
  export class AppModule {}