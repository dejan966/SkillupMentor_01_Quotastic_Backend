import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieparser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './modules/app.module';
import { UserGuard } from './modules/auth/guards/user.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieparser())

  const config = new DocumentBuilder()
  .setTitle('NestJS Tutorial API')
  .setDescription('This is API from NestJS tutorial')
  .setVersion('1.0.0')
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)
}
bootstrap();