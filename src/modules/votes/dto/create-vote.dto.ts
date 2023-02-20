import { IsNotEmpty, IsOptional } from "class-validator/types/decorator/decorators";
import { Quote } from "src/entities/quote.entity";
import { User } from "src/entities/user.entity";

export class CreateVoteDto {
    @IsNotEmpty()
    value:boolean

    @IsNotEmpty()
    quote: Quote

    @IsNotEmpty()
    user: User
}