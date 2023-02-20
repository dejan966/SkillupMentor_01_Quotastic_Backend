import { IsNotEmpty } from "class-validator/types/decorator/decorators";

export class CreateVoteDto {
    @IsNotEmpty()
    upvote:boolean
}