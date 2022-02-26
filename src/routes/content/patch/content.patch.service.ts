import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ContentPatchDto from "./content.patch.dto";

const patchContent = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const { alt, display, thumbnail, uuid } = req.body as ContentPatchDto;

    const project = await db.asset.update({
        data: {
            alt: alt?.substr(0, 127),
            display,
            thumbnail,
            project: { update: { updated: new Date() } },
        },
        where: { uuid },
    });

    res.json({ uuid: project.uuid });
};

export default patchContent;