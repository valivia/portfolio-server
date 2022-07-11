import { experience, experience_category } from "@prisma/client";
import { Type } from "class-transformer";
import {
    Length,
    IsString,
    IsDefined,
    IsDateString,
    IsOptional,
    IsEnum,
    IsUrl,
    IsNumber,
    Max,
    Min,
    IsUUID,
} from "class-validator";

class ExperiencePostDto implements Omit<experience, "created" | "uuid"> {
    @Length(2, 32)
    @IsDefined()
    public name: string;

    @IsOptional()
    @Length(0, 256)
    public description: string;

    @IsOptional()
    @IsUrl()
    public website: string;

    @IsOptional()
    @IsUUID()
    public project_uuid?: string;

    @Type(() => Number)
    @IsNumber()
    @Max(100)
    @Min(0)
    public score: number;

    @IsDateString()
    public used_since: Date;

    @IsString()
    @IsEnum(experience_category)
    public category: experience_category;
}

export default ExperiencePostDto;
