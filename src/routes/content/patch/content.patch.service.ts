import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import revalidate from "../../../util/revalidate.service";
import ContentPatchDto from "./content.patch.dto";

const patchContent = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const { alt, description, display, uuid } = req.body as ContentPatchDto;

    const asset = await db.asset.update({
        data: {
            alt: alt?.substring(0, 127),
            description: description?.substring(0, 127),
            display,
            project: { update: { updated: new Date() } },
        },
        where: { uuid },
    });

    res.json({ asset: asset });

    await revalidate(`project/${uuid}`);
};

export default patchContent;