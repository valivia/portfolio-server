import { IsNumberString, Length } from "class-validator";

export default class AuthDto {

    @Length(6, 6)
    @IsNumberString({ no_symbols: true })
    public code: string;
}