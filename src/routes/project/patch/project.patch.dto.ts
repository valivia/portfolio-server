import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import ProjectPostDto from "../post/project.post.dto";

export default class ProjectPatchDto extends ProjectPostDto {
    @IsUUID(4)
    public uuid: string

    @IsOptional()
    @IsBoolean()
    public projects: boolean;

    @IsOptional()
    @IsBoolean()
    public pinned: boolean;

}