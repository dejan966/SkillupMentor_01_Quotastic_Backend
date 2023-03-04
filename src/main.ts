import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
//import * as cookieparser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieparser());
  
  const dirname = path.resolve();
  app.use('/uploads', express.static(path.join(dirname, '/uploads')))
  
  //app.use(express.static('public'))

  const config = new DocumentBuilder().setTitle('Quoastic').setDescription('This is the Quotastic app').setVersion('1.0.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
}
bootstrap();
