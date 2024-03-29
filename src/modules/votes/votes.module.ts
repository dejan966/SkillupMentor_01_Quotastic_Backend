import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from 'entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesService } from '../quotes/quotes.service';
import { Quote } from 'entities/quote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), TypeOrmModule.forFeature([Quote])],
  controllers: [VotesController],
  providers: [VotesService, QuotesService],
})
export class VotesModule {}
