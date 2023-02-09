import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
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

  async findUserVotes(user:User, quote:Quote) {
    return this.votesRepository.find({where : {user, quote}})
  }

  async findUserVote(user:User, quote:Quote):Promise<Vote>{
    const getVote = this.votesRepository.findOne({where : {user, quote}})
    return getVote
  }
  
  async voting(value: boolean, user: User, quote: Quote){
    const getVote = await this.findUserVote(user, quote)
    if(getVote){
      if(getVote.value === value) return this.delete(getVote.id).then(() => {
          const karma = value ? getVote.quote.karma - 1 : getVote.quote.karma + 1
          return this.quotesService.update(getVote.quote.id, new UpdateQuoteDto[karma])
      })
      return this.update(getVote.id).then(() => {
          const karma = value ? getVote.quote.karma + 2 : getVote.quote.karma - 2
          return this.quotesService.update(getVote.quote.id, new UpdateQuoteDto[karma])
      }) 
    }
    const vote = await this.votesRepository.create({value, user, quote}) as Vote
    return this.votesRepository.save(vote).then(() => {
        const karma = value ? vote.quote.karma + 1 : vote.quote.karma - 1
        return this.quotesService.update(vote.quote.id, new UpdateQuoteDto[karma])
    })
  }

  async create(value: Boolean, user: User, quote: Quote){
    /* const vote = await this.votesRepository.create({value, user, quote}) as Vote
    return this.votesRepository.save(vote).then(() => {
        const karma = value ? vote.quote.karma + 1 : vote.quote.karma - 1
        return this.quotesService.update(vote.quote.id, new UpdateQuoteDto[karma])
    }) */
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