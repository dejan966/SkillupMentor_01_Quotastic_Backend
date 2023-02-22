import { IsNotEmpty } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateQuoteDto {
  @IsNotEmpty()
  quote: string;
  user: User;
}
