import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import revalidate from "../../../util/revalidate.service";
import ContentPostBannerDto from "./content.post.banner.dto";


const patchBanner = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {

    const { project, asset } = req.body as ContentPostBannerDto;

    await db.project.updateMany({ where: { uuid: project }, data: { banner_id: null } });
    const out = await db.project.update({ where: { uuid: project }, data: { banner_id: asset } });

    res.json({ out });

    await revalidate(`project/${project}`);
};

export default patchBanner;