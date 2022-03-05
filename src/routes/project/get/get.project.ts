import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import NotFoundException from "../../../exceptions/notFound";

export default class GetProjectService {
    public async main(req: Request, res: Response, db: PrismaClient): Promise<void> {
        const uuid = req.params.id;

        const project = await db.project.findUnique({ where: { uuid }, include: { assets: true, tags: true, links: true } }).catch(() => null);

        if (project === null) throw new NotFoundException();

        res.json(project);
    }
}
