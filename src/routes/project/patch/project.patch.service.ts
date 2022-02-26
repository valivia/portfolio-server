import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ProjectPatchDto from "./project.patch.dto";

const patchProject = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const { uuid, name, description, status, created, markdown, external_url, projects, pinned } = req.body as ProjectPatchDto;

    let { tags } = req.body;

    if (typeof tags == "string") { tags = [tags]; }

    const tagArray: { uuid: string }[] = tags.map(((x: string) => ({ uuid: x })));

    const project = await db.project.update({
        data: {
            created: new Date(created),
            name,
            description,
            markdown,
            status,
            external_url,
            projects,
            pinned,
            tags: { set: tagArray },
            updated: new Date(),
        },
        where: { uuid },
    });

    res.json({ project: project });
};

export default patchProject;