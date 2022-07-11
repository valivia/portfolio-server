import { IsUUID, IsDateString } from "class-validator";
import ExperiencePostDto from "../post/dto";

class ExperiencePatchDto extends ExperiencePostDto {
    @IsUUID()
    public uuid: string;

    @IsDateString()
    public created: Date;
}

export default ExperiencePatchDto;
