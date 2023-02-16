import { IsNotEmpty, IsOptional } from "class-validator/types/decorator/decorators";

export class CreateVoteDto {
    @IsNotEmpty()
    value:boolean

    @IsNotEmpty()
    quote_id: number

    @IsNotEmpty()
    user_id: number
}