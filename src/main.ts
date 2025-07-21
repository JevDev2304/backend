import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://frontend-bx19ohve6-juan-esteban-valdes-projects.vercel.app/', // Replace with your frontend's actual URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
  });
  const config = new DocumentBuilder()
  .setTitle('Backend API') // Your API Title
  .setDescription('This is the Backend API of the Juan Esteban Valdés Ospina Tech test') // Your API Description
  .setVersion('1.0') // Your API Version // Optional: Adds a tag to group endpoints in Swagger UI
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
