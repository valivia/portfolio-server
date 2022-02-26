import { IsUUID } from "class-validator";

class ContentDeleteDto {

    @IsUUID(4)
    public uuid: string
}

export default ContentDeleteDto;