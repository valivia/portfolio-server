import { IsUUID } from "class-validator";

class ExperienceDeleteDto {

    @IsUUID(4)
    public uuid: string
}

export default ExperienceDeleteDto;