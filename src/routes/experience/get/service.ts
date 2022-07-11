import { tag, PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";

export default async function getExperience(
    req: Request,
    res: Response,
    db: PrismaClient,
): Promise<void> {
    const uuid = req.params.uuid;
    let experiences: null | tag | tag[];

    if (uuid === undefined)
        experiences = await db.tag
            .findMany({
                where: {
                    NOT: {
                        score: null,
                    },
                },
                include: {
                    notable_project: true,
                    projects: {
                        select: { name: true, uuid: true },
                        orderBy: { created: "desc" },
                    },
                },
                orderBy: { name: "asc" },
            })
            .catch(() => null);
    else
        experiences = await db.tag
            .findFirst({
                where: {
                    uuid,
                    NOT: {
                        score: null,
                    },
                },
                include: {
                    notable_project: true,
                    projects: {
                        select: { name: true, uuid: true },
                        orderBy: { created: "desc" },
                    },
                },
            })
            .catch(() => null);

    if (experiences === null) throw new NotFoundException();

    res.json(experiences);
}
