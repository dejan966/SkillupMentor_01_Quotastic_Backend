import { IsOptional } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  quote?: string;

  @IsOptional()
  karma?: number;
}
