import { IsNotEmpty } from "class-validator";

export class UpdateQuoteDto {
    @IsNotEmpty()
    quote:string;
    
    @IsNotEmpty()
    karma:number;
    
    @IsNotEmpty()
    user_id: number
}