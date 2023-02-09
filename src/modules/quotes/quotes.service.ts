import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { And, Repository } from 'typeorm';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService{
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepository: Repository<Quote>){}
    
  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    try {
      const quote = this.quotesRepository.create({ ...createQuoteDto })
      return this.quotesRepository.save(quote)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while posting a quote')
    }
  }

  async findAll() {
    return await this.quotesRepository.find()
  }

  async findById(quoteId: number, userData: User):Promise<Quote> {
    const quote = await this.quotesRepository.findOne({ where: { id: quoteId, user: userData }})
    return quote
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    const quote = await this.quotesRepository.findOne({ where: { id }})
    try {
      quote.quote = updateQuoteDto.quote;
      return this.quotesRepository.save(quote)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while updating the quote')
    } 
  }

  async remove(id: number) {
    const quote = await this.quotesRepository.findOne({ where: { id }})
    return this.quotesRepository.delete(quote)
  }
}