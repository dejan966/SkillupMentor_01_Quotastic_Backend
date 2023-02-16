import { IsNotEmpty } from "class-validator";
import { User } from "src/entities/user.entity";

export class UpdateQuoteDto {
    @IsNotEmpty()
    quote:string;

    @IsNotEmpty()
    karma:number;
}