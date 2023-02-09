import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get()
  async findUserVotes(user:User, quote:Quote) {
    return this.votesService.findUserVotes(user, quote);
  }
  
  @Get(':id')
  async findUserVote(user:User, quote:Quote) {
    return this.votesService.findUserVote(user, quote);
  }

  @Patch(':id')
  async vote(value: boolean, user: User, quote: Quote) {
    return this.votesService.voting(value, user, quote);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.votesService.delete(id);
  }
}