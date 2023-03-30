import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'entities/quote.entity';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto'

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepository: Repository<Quote>
  ) {}

  async create(createQuoteDto: CreateQuoteDto, user: User): Promise<Quote> {
    try {
      const quote = this.quotesRepository.create({ ...createQuoteDto, user });
      return this.quotesRepository.save(quote);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('Something went wrong while posting a quote.');
    }
  }

  async findMostUpvotedQuotes() {
    return await this.quotesRepository.find({ relations: ['user', 'votes.user'], order:{karma:"DESC"} });
  }

  async findMostRecentQuotes(): Promise<Quote[]> {
    return await this.quotesRepository.find({ relations: ['user', 'votes.user'], order:{posted_when:"DESC"} });
  }

  async findUserQuote(user: User, quote: string): Promise<Quote> {
    const userQuote = this.quotesRepository.findOne({ where: { user, quote }, relations: ['user', 'votes.user'] });
    return userQuote;
  }

  async findUserQuotes(userId:number){
    const userQuotes = await this.quotesRepository.find({ where: { user:{id:userId} }, relations: ['user', 'votes.user'], order:{posted_when:"DESC"} });
    return userQuotes;
  }

  async findCurrUserQuotes(user:User) {
    const userQuotes = await this.quotesRepository.find({ where: { user:{id:user.id} }, relations: ['user'], order:{posted_when:"DESC"} });
    return userQuotes;
  }

  async findById(id: number): Promise<Quote> {
    try {
      const quote = await this.quotesRepository.findOneOrFail({ where: { id }, relations: ['user', 'votes.quote']});
      return quote;
    } catch (error) {
      Logging.error(error)
      throw new NotFoundException(`Unable to find a quote with an id of ${id}.`);
    }
  }

  async findRandomQuote():Promise<Quote>{
    return await this.quotesRepository.createQueryBuilder("quote").innerJoinAndSelect("quote.user", "user").leftJoinAndSelect("quote.votes", "vote").leftJoinAndSelect("vote.user", "user2").orderBy('RANDOM()').getOne()
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    try {
      const quote = await this.findById(id);
      for (const key in quote) {
        if (updateQuoteDto[key] !== undefined) quote[key] = updateQuoteDto[key];
      }
      return this.quotesRepository.save(quote);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException('Something went wrong while updating the quote.');
    }
  }

  async remove(id: number): Promise<Quote> {
    const quote = await this.findById(id);
    try {
      return this.quotesRepository.remove(quote);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException('Something went wrong while deleting the quote.');
    }
  }
}
