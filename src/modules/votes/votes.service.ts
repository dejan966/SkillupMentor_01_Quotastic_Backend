import { Injectable } from '@nestjs/common';

@Injectable()
export class VotesService {
  create() {
    return 'This action adds a new vote';
  }

  findAll() {
    return `This action returns all votes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
