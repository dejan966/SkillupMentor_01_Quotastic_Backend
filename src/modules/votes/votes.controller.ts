import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get()
  async findAll() {
    return this.votesService.findAll();
  }

  @Patch(':id')
  async vote(@Param('id') id: number) {
    return this.votesService.vote(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.votesService.remove(id);
  }
}
