import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class CreateQuoteDto {
    karma:number;

    @IsNotEmpty()
    quote:string;
    
    posted_when: string

    @IsNotEmpty()
    user_id: number
}