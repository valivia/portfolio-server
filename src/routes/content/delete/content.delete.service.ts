import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";
import deleteAsset from "../../../util/deleteAsset.service";
import revalidate from "../../../util/revalidate.service";

const deleteContent = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const uuid = req.body.uuid;

    const assets = await db.asset.findFirst({ where: { uuid: uuid } });

    if (!assets) throw new NotFoundException();

    const asset = await db.asset.delete({ where: { uuid: uuid } });
    await db.project.update({ where: { uuid: asset.project_id }, data: { updated: new Date() } });

    deleteAsset(asset.uuid);
    res.json(asset);

    await revalidate(`project/${uuid}`);
};

export default deleteContent;