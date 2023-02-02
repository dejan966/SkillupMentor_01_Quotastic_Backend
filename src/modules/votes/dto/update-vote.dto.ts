import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateVoteDto {
    @IsOptional()
    upvote:boolean;
    
    @IsOptional()
    downvote:boolean;

    @IsNotEmpty()
    quote_id: number
}
