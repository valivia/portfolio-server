import { IsBoolean, IsOptional, IsUUID, Length } from "class-validator";

class ContentPatchDto {

    @IsUUID(4)
    public uuid: string

    @IsOptional()
    @Length(0, 1024)
    public description: string;

    @IsOptional()
    @Length(0, 128)
    public alt: string;

    @IsBoolean()
    public display: boolean;

    @IsBoolean()
    public thumbnail: boolean;

}

export default ContentPatchDto;