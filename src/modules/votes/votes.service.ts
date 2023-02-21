import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { UpdateQuoteDto } from '../quotes/dto/update-quote.dto';
import { QuotesService } from '../quotes/quotes.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
    private readonly quotesService: QuotesService
  ) {}

  async createVote(value: boolean, user: User, quoteId: number){
    try {
      const quote = await this.quotesService.findById(quoteId)
      const newVote = this.votesRepository.create({ value, user, quote }) as Vote
      return this.votesRepository.save(newVote).then(() => {
        const karma = value ? newVote.quote.karma + 1 : newVote.quote.karma - 1
        return this.quotesService.update(newVote.quote.id, {karma})
      })
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while voting')
    }
  }

  async findAllUsersVotes():Promise<Vote[]> {
    return this.votesRepository.find({relations:['user', 'quote']})
  }

  async findUserVote(user:User, quote:Quote){
    const getVote = this.votesRepository.findOne({where : {user, quote},  relations:['quote.votes']})
    return getVote
  }
  
  async voting(value: boolean, user: User, quote: Quote){
    const getVote = await this.findUserVote(user, quote)
    if(getVote){
      if(getVote.value === value) return this.delete(getVote.id).then(() => {
          const karma = value ? getVote.quote.karma - 1 : getVote.quote.karma + 1
          return this.quotesService.update(getVote.quote.id, {karma})
      })
      return this.update(getVote.id).then(() => {
          const karma = value ? getVote.quote.karma + 2 : getVote.quote.karma - 2
          return this.quotesService.update(getVote.quote.id, {karma})
      }) 
    }
  }

  async update(id: number){
    const vote = await this.votesRepository.findOne({where : {id}})
    vote.value = !vote.value
    return await this.votesRepository.save(vote)
  }

  async delete(id: number) {
    const vote = await this.votesRepository.findOne({ where: { id }})
    return this.votesRepository.remove(vote)
  }
}