import { IsNotEmpty } from "class-validator";

export class UpdateQuoteDto {
    @IsNotEmpty()
    quote:string
}