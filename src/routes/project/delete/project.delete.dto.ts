import { IsUUID } from "class-validator";

class ProjectDeleteDto {

    @IsUUID(4)
    public uuid: string
}

export default ProjectDeleteDto;