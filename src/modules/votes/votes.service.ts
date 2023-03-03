import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { QuotesService } from '../quotes/quotes.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
    private readonly quotesService: QuotesService,
  ) {}

  async createVote(value: boolean, user: User, quoteId: number) {
    try {
      const vote = (await this.findUserQuoteVote(user, quoteId)) as Vote;
      if (vote) { 
        if (vote.value === value) {
          return this.delete(vote.id).then(() => {
            const karma = value ? vote.quote.karma - 1 : vote.quote.karma + 1;
            return this.quotesService.update(vote.quote.id, { karma });
          });
        }
        return this.update(vote.id).then(() => {
          const karma = value ? vote.quote.karma + 2 : vote.quote.karma - 2;
          return this.quotesService.update(vote.quote.id, { karma });
        });
      }
      const quote = await this.quotesService.findById(quoteId);
      const newVote = this.votesRepository.create({ value, user, quote }) as Vote;
      return this.votesRepository.save(newVote).then(() => {
        const karma = value ? newVote.quote.karma + 1 : newVote.quote.karma - 1;
        return this.quotesService.update(newVote.quote.id, { karma });
      });
    } catch (error) {
      Logging.log(error);
      throw new BadRequestException('Something went wrong while casting a vote.');
    }
  }

  async findOne(value: boolean, user: User, quoteId: number): Promise<Vote> {
    const vote = await this.votesRepository.findOne({ where: { value, user: { email: user.email }, quote: { id: quoteId } }, relations: ['user', 'quote'] });
    return vote;
  }

  async findAllUserVotes(userId: number){
    return this.votesRepository.find({ where:{user:{id:userId}}, relations: ['quote.user'] });
  }

  async findAllCurrUserVotes(user: User){
    return this.votesRepository.find({ where:{user: {id:user.id}, value:true}, relations: ['quote.user'] });
  }

  async findAllUsersVotes(){
    return this.votesRepository.find({ relations: ['user', 'quote'] });
  }

  async findUserQuoteVote(user: User, quoteId: number):Promise<Vote> {
    const getVote = await this.votesRepository.findOne({ where: { 
      user: { email: user.email },
      quote: { id: quoteId } }, 
      relations: ['user', 'quote'] 
    });
    return getVote;
  }

  async update(id: number) {
    const vote = await this.votesRepository.findOne({ where: { id } });
    vote.value = !vote.value;
    return await this.votesRepository.save(vote);
  }

  async delete(id: number) {
    const vote = await this.votesRepository.findOne({ where: { id } });
    return this.votesRepository.remove(vote);
  }
}
