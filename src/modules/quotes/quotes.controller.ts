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

@Controller('quotes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  async findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.quotesService.findById(id);
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