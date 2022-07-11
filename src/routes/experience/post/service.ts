import HttpException from "../../../exceptions/httpExceptions";
import revalidate from "../../../util/revalidate.service";
import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import ExperiencePostDto from "./dto";

export default async function postExperience(
    req: Request,
    res: Response,
    db: PrismaClient,
): Promise<void> {
    const { name, description, website, project_uuid, used_since, category } =
        req.body as ExperiencePostDto;

    let { score } = req.body as ExperiencePostDto;
    score = Number(score);
    if (score < 0 || score > 100)
        throw new HttpException(400, "Score is out of range");

    const file = req.file?.buffer;

    if (!file) throw new HttpException(400, "No file provided");

    const uuid = uuidv4();
    const path = `./media/icon/${uuid}.svg`;

    fs.writeFileSync(path, file);

    const experience = await db.tag.create({
        data: {
            uuid,
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
