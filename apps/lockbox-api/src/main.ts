import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import logger from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });

  logger.info('Started application...');
  await app.listen(process.env.PORT);
}
bootstrap();
