import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import revalidate from "../../../util/revalidate.service";
import ProjectPatchDto from "./project.patch.dto";

const patchProject = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const { uuid, name, description, status, created, markdown, projects, pinned } = req.body as ProjectPatchDto;

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
            projects,
            pinned,
            tags: { set: tagArray },
            updated: new Date(),
        },
        include: { tags: true },
        where: { uuid },
    });

    res.json({ project });
    await revalidate(`project/${project.uuid}`);
    await revalidate(`browse`);
    if (projects) await revalidate(`projects`);
};

export default patchProject;