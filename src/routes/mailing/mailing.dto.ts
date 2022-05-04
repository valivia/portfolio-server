import { IsEmail } from "class-validator";

class MailingPostDto {

    @IsEmail()
    public email: string

}

export default MailingPostDto;