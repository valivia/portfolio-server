import { project_status } from "@prisma/client";
import { Length, IsString, IsUUID, IsDefined, IsDateString, IsOptional, IsUrl, IsBooleanString } from "class-validator";

class ProjectPostDto {


    @Length(2, 32)
    @IsDefined()
    public name: string;

    @IsOptional()
    @Length(0, 256)
    public description: string;

    @IsOptional()
    @Length(0, 4096)
    public markdown: string;

    @IsOptional()
    @IsUrl()
    public external_url: string;

    @IsUUID(4, { each: true })
    public tags: number[];

    @IsString()
    public status: project_status;

    @IsOptional()
    @IsBooleanString()
    public projects: boolean | string;

    @IsOptional()
    @IsBooleanString()
    public pinned: boolean | string;

    @IsDateString()
    public created: string;
}

export default ProjectPostDto;