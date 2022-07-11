import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";
import fs from "fs";
import revalidate from "../../../util/revalidate.service";

const deleteExperience = async (
    req: Request,
    res: Response,
    db: PrismaClient,
): Promise<void> => {
    const uuid = req.body.uuid;

    const experience = await db.tag.findUnique({ where: { uuid } });
    if (!experience) throw new NotFoundException();

    const deletedExperience = await db.tag.delete({ where: { uuid } });

    const path = `./media/icon/${deletedExperience.uuid}.svg`;

    fs.unlinkSync(path);

    res.json({ uuid: deletedExperience.uuid });

    await revalidate(`about`);
};

export default deleteExperience;
