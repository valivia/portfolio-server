import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";
import deleteAsset from "../../../util/deleteAsset.service";

const deleteContent = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const uuid = req.body.uuid;

    const assets = await db.asset.findFirst({ where: { uuid: uuid } });

    if (!assets) throw new NotFoundException();

    const deleteAssets = await db.asset.delete({ where: { uuid: uuid } });
    await db.project.update({ where: { uuid: deleteAssets.project_id }, data: { updated: new Date() } });

    deleteAsset(deleteAssets.uuid);

    res.json(":)");
};

export default deleteContent;