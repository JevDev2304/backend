import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // La corrección clave está aquí: sin comillas
    origin: /https:\/\/frontend-.*-juan-esteban-valdes-projects\.vercel\.app$/,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('This is the Backend API of the Juan Esteban Valdés Ospina Tech test')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Asegúrate de escuchar en '0.0.0.0' para Render
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();