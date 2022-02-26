import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";

export default async function GetProjectsService(req: Request, res: Response, db: PrismaClient): Promise<void> {
    const projects = req.query.projects == "true";
    const where = projects ? { projects } : {};

    const response = await db.project.findMany({ include: { assets: true, tags: true }, where });

    res.json(response);
}
