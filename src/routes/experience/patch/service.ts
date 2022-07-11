import { PrismaClient } from ".prisma/client";
import HttpException from "../../../exceptions/httpExceptions";
import { Request, Response } from "express";
import revalidate from "../../../util/revalidate.service";
import ExperiencePatchDto from "./dto";

export default async function patchExperience(
    req: Request,
    res: Response,
    db: PrismaClient,
): Promise<void> {
    const {
        uuid,
        name,
        description,
        website,
        project_uuid,
        used_since,
        category,
    } = req.body as ExperiencePatchDto;

    let { score } = req.body as ExperiencePatchDto;
    score = Number(score);
    if (score < 0 || score > 100)
        throw new HttpException(400, "Score is out of range");

    const experience = await db.tag.update({
        where: { uuid },
        data: {
            name,
            score,
            website,
            category,
            description,
            used_since: new Date(used_since),
            project_uuid,
        },
    });

    await revalidate(`about`);

    res.json({ experience });
}
