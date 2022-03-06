import { PrismaClient } from ".prisma/client";
import { Response, Request } from "express";

function formatDescription(input: string | null): string {
    if (!input) return "";
    return input.length > 127 ? `${input.substring(0, 127)}...` : input;
}

export default class GetGalleryService {
    public async main(_req: Request, res: Response, db: PrismaClient): Promise<void> {

        const content = await db.asset.findMany({ where: { display: true }, include: { project: { include: { tags: true } } } });

        const response = content.map((asset) => {
            return {
                size: Math.min(asset.height, asset.width),
                alt: asset.alt,
                type: asset.type,
                uuid: asset.uuid,
                created: Number(asset.project.created),
                name: asset.project.name,
                thumbnail: asset.project.banner_id == asset.uuid,
                status: asset.project.status,
                project_uuid: asset.project.uuid,
                tags: asset.project.tags,
                description: formatDescription(asset.project.description),
            };
        });

        response.sort((y, x) => x.created - y.created);

        res.json(response);
    }
}