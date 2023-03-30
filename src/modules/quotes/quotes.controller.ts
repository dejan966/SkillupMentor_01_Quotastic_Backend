import { 
  Controller, 
  Get, 
  Post,
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors,
  ClassSerializerInterceptor, 
  UseGuards 
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { User } from 'entities/user.entity';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserGuard } from '../auth/guards/user.guard';

@Controller('quotes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto, @GetCurrentUser() user: User) {
    return this.quotesService.create(createQuoteDto, user);
  }

  @Get()
  async findQuotes() {
    return this.quotesService.findMostUpvotedQuotes();
  }

  @Get('recent')
  async findRecentQuotes() {
    return this.quotesService.findMostRecentQuotes();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllCurrUserQuotes(@GetCurrentUser() user: User) {
    return this.quotesService.findCurrUserQuotes(user);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async findAllUserQuotes(@Param('id') userId: number) {
    return this.quotesService.findUserQuotes(userId);
  }

  @Get('random')
  async findRandomQuote() {
    return this.quotesService.findRandomQuote();
  }

  @Get(':id')
  async findOne(@Param('id') quoteId: number) {
    return this.quotesService.findById(quoteId);
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.quotesService.remove(id);
  }
}
