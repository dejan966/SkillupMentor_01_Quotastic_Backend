import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from '../config/schema.config';
import { UsersModule } from 'src/users/users.module';
import { QuotesModule } from 'src/quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
    UsersModule,
    QuotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
