// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lista de URLs exactas permitidas
  const allowedOrigins = [
    'https://frontend-murex-one-49.vercel.app', // Tu URL de producción fija
    'http://localhost:5173',                   // Para desarrollo local
  ];
  
  // Expresión regular para cualquier otro despliegue de Vercel
  const allowedOriginsRegex = /^https:\/\/frontend-.*\.vercel\.app$/;

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      
      // Comprueba si el origen está en la lista fija O si coincide con la regex
      if (allowedOrigins.includes(origin) || allowedOriginsRegex.test(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // ... tu código de Swagger ...
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();