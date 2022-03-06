import { IsUUID } from "class-validator";

class ContentPostBannerDto {

    @IsUUID(4)
    public project: string

    @IsUUID(4)
    public asset: string

}

export default ContentPostBannerDto;