import { IsNotEmpty, IsOptional } from 'class-validator/types/decorator/decorators';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';

export class CreateVoteDto {
  @IsNotEmpty()
  value: boolean;
  quote: Quote;
  user: User;
}
