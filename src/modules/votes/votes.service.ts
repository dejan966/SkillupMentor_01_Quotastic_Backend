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

  async create(createVoteDto: CreateVoteDto, quoteId: number ) {
    try {
      const role = this.votesRepository.create({ ...createVoteDto, quote: quoteId })
      return this.votesRepository.save(role)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating a new role')
    }
  }

/*   async findAll() : Promise<Vote[]> {
    
  } */

/*   async findById(id: number) : Promise<Vote> {
    
  } */

  async update(id: number, updateVoteDto: UpdateVoteDto) : Promise<Vote> {
    const vote = (await this.findById(id)) as Vote

    try {
      vote.upvote = updateVoteDto.upvote
      vote.downvote = updateVoteDto.downvote
      return this.votesRepository.save(vote)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while updating votes')
    } 
  }

  async remove(id: number) : Promise<Vote> {
    
  }
}
