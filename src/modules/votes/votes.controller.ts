import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: {
          type: 'boolean',
          example: true,
        },
        user:{
          type:'object',
          example: User
        },
        quote:{
          type:'object',
          example: Quote
        },
      },
    },
  })
  async create(value: boolean, @GetCurrentUser() user: User, quote: Quote){
    return this.votesService.createVote(value, user, quote)
  }

  @Get()
  async findAllUsersVotes() {
    return this.votesService.findAllUsersVotes()
  }

  @Get(':id')
  async findUserVotes(user:User, quote:Quote) {
    return this.votesService.findUserVotes(user, quote)
  }

  @Get('me')
  async findAllCurrUserVotes(@GetCurrentUser() user:User) {
    return this.votesService.findAllCurrUserVotes(user)
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':id')
  async vote(value: boolean, @GetCurrentUser() user: User, quote: Quote) {
    return this.votesService.voting(value, user, quote)
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.votesService.delete(id)
  }
}