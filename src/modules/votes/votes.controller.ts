import { Controller, Get, Post, Param, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { NotAuthorGuard } from '../auth/guards/not-author.guard';
import { VotesService } from './votes.service';

@Controller('votes')
@UseInterceptors(ClassSerializerInterceptor)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard, NotAuthorGuard)
  @Post(':id/upvote')
  async createUpvote(@GetCurrentUser() user: User, @Param('id') quoteId: number) {
    return this.votesService.createVote(true, user, quoteId);
  }

  @UseGuards(JwtAuthGuard, NotAuthorGuard)
  @Post(':id/downvote')
  async createDownvote(@GetCurrentUser() user: User, @Param('id') quoteId: number) {
    return this.votesService.createVote(false, user, quoteId);
  }

  @Get()
  async findAllUsersVotes() {
    return this.votesService.findAllUsersVotes();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllCurrUserVotes(@GetCurrentUser() user: User) {
    return this.votesService.findAllCurrUserVotes(user);
  
  }
  @Get('users/:id')
  async findAllUserVotes(@Param('id') id: number) {
    return this.votesService.findAllUserVotes(id);
  }
}
