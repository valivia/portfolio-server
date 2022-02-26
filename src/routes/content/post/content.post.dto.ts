import { IsBooleanString, IsOptional, IsUUID, Length } from "class-validator";

class ContentPostDto {


    @IsOptional()
    @IsBooleanString()
    public display: string;

    @IsUUID(4)
    public uuid: string

    @IsOptional()
    @Length(0, 128)
    public alt: string;
}

export default ContentPostDto;