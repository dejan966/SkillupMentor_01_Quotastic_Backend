import { IsNotEmpty } from "class-validator/types/decorator/decorators";

export class UpdateVoteDto {
    @IsNotEmpty()
    value:boolean
    karma:number
}