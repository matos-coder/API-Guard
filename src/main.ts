import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
  const app = await NestFactory.create(AppModule);

  // 1. Build the configuration
  const config = new DocumentBuilder()
    .setTitle('My API Title')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users') // Optional: add tags to group your endpoints
    .build();

  // 2. Create the document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the Swagger UI at a specific path (e.g., 'api')
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
