import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from 'src/entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  controllers: [VotesController],
  providers: [VotesService]
})
export class VotesModule {}
