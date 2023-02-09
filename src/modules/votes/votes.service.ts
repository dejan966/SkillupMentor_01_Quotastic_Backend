import { Injectable } from '@nestjs/common';

@Injectable()
export class VotesService {
  async findAll() {
    return `This action returns all votes`;
  }

  async vote(id: number) {
    return `This action updates a #${id} vote`;
  }

  async remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
