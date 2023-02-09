import { IsNotEmpty } from "class-validator";

export class CreateQuoteDto {
    @IsNotEmpty()
    karma:number;

    @IsNotEmpty()
    quote:string;
    
    @IsNotEmpty()
    posted_when: string

    @IsNotEmpty()
    user_id: number
}