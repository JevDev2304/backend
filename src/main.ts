// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lista de URLs exactas permitidas
  const allowedOrigins = [
    'https://frontend-murex-one-49.vercel.app', // Producción fija
    'http://localhost:5173',                   // Desarrollo local
  ];
  
  // Expresión regular para cualquier otro despliegue de Vercel
  const allowedOriginsRegex = /^https:\/\/frontend-.*\.vercel\.app$/;

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || allowedOriginsRegex.test(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // -------------------
  // Configuración Swagger
  // -------------------
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Endpoints for the application backend')
    .setVersion('1.0')
    .addBearerAuth() // Habilita JWT Bearer token (opcional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Ruta /docs

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
