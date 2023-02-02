import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from 'src/entities/vote.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService extends AbstractService {
  constructor(
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>) {
      super(votesRepository)
    }

  async create(createVoteDto: CreateVoteDto) {
    try {
      const vote = this.votesRepository.create({ ...createVoteDto })
      return this.votesRepository.save(vote)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while casting a vote')
    }
  }

  async findById(user_id: number) : Promise<Vote[]> {
    const votes = (await this.findById(user_id)) as Vote[]
    return this.votesRepository.save(votes)
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) : Promise<Vote> {
    const vote = (await this.findById(id)) as unknown as Vote
    try {
      vote.upvote = updateVoteDto.upvote
      vote.downvote = updateVoteDto.downvote
      return this.votesRepository.save(vote)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while updating votes')
    } 
  }
}
