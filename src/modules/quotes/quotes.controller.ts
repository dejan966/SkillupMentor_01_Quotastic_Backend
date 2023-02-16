import { 
  Controller,
   Get, 
   Post, 
   Body, 
   Patch, 
   Param, 
   Delete, 
   UseInterceptors,
   ClassSerializerInterceptor
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { User } from 'src/entities/user.entity';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';

@Controller('quotes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async create(@GetCurrentUser() user:User, @Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto, user);
  }

  @Get()
  async findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') quoteId: number, userData: User) {
    return this.quotesService.findById(quoteId, userData);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.quotesService.remove(id);
  }
}