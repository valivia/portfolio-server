import { IsBooleanString, IsOptional, IsUUID, Length } from "class-validator";

class ContentPostDto {

    @IsUUID(4)
    public uuid: string

    @IsOptional()
    @Length(0, 1024)
    public description: string;

    @IsOptional()
    @Length(0, 128)
    public alt: string;

    @IsOptional()
    @IsBooleanString()
    public display: string;

}

export default ContentPostDto;