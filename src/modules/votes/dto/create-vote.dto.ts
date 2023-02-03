import { IsNotEmpty, IsOptional } from "class-validator/types/decorator/decorators";

export class CreateVoteDto {
    @IsOptional()
    upvote:boolean;
    
    @IsOptional()
    downvote:boolean;

    @IsNotEmpty()
    quote_id: number

    @IsNotEmpty()
    user_id: number
}
