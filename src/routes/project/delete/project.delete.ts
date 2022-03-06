import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";
import deleteAsset from "../../../util/deleteAsset.service";
import revalidate from "../../../util/revalidate.service";

const deleteProject = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const uuid = req.body.uuid;

    const project = await db.project.findUnique({ where: { uuid } });
    if (!project) throw new NotFoundException();

    const assets = await db.asset.findMany({ where: { project_id: uuid } });

    const deleteAssets = db.asset.deleteMany({ where: { project_id: uuid } });
    const delProjectQuery = db.project.delete({ where: { uuid } });

    await db.$transaction([deleteAssets, delProjectQuery]);

    assets.forEach((asset) => { deleteAsset(asset.uuid); });

    res.json(":)");

    await revalidate(`project/${uuid}`);
    await revalidate(`browse`);
};

export default deleteProject;