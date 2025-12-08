import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips properties not defined in the DTO
    transform: true, // Transforms payload objects to DTO class instances
  })); 
  
  await app.listen(3000);
}
bootstrap();