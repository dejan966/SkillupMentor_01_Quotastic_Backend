import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService extends AbstractService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepository: Repository<Quote>) 
    { super(quotesRepository) 
  }
  
  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    try {
      const quote = this.quotesRepository.create({ ...createQuoteDto })
      return this.quotesRepository.save(quote)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while posting a quote')
    }
  }

  async findAll():Promise<Quote[]> {
    const quote = (await this.findAll()) as Quote[]
    return this.quotesRepository.save(quote)
  }

  async findById(id: number):Promise<Quote> {
    const quote = (await this.findById(id)) as Quote
    return this.quotesRepository.save(quote)
  }

  async update(quoteId: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    const quote = (await this.findById(quoteId)) as Quote
    try {
      quote.quote = updateQuoteDto.quote;
      return this.quotesRepository.save(quote)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while updating the quote')
    } 
  }

  async remove(id: number) {
    const quote = (await this.findById(id)) as Quote
    return this.quotesRepository.delete(quote)
  }
}