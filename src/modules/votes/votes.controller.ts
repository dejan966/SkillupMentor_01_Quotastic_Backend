import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { NotAuthorGuard } from '../auth/guards/not-author.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard, NotAuthorGuard)
  @Post('upvote/:id')
  async createUpvote(@GetCurrentUser() user: User, @Param('id') quoteId: number){
    return this.votesService.createVote(true, user, quoteId)
  }

  @UseGuards(JwtAuthGuard, NotAuthorGuard)
  @Post('downvote/:id')
  async createDownvote(@GetCurrentUser() user: User, @Param('id') quoteId: number){
    return this.votesService.createVote(false, user, quoteId)
  }

  @Get()
  async findAllUsersVotes() {
    return this.votesService.findAllUsersVotes()
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllCurrUserVotes(@GetCurrentUser() user:User) {
    return user.votes
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':id')
  async vote(value: boolean, @GetCurrentUser() user: User, quote: Quote) {
    return this.votesService.voting(value, user, quote)
  }
}