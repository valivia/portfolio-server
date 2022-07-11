import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ServerErrorException from "../../../exceptions/serverError";
import revalidate from "../../../util/revalidate.service";
import ProjectPostDto from "./project.post.dto";

const postProject = async (
    req: Request,
    res: Response,
    db: PrismaClient,
): Promise<void> => {
    const { name, description, status, created, markdown } =
        req.body as ProjectPostDto;
    const projects = (req.body as ProjectPostDto).projects == "true";
    const pinned = (req.body as ProjectPostDto).pinned == "true";

    let { tags } = req.body;
    let assets = {};

    if (typeof tags == "string") {
        tags = [tags];
    }

    const tagArray: { uuid: string }[] = tags.map((x: string) => ({ uuid: x }));

    const project = await db.project
        .create({
            data: {
                created: new Date(created),
                name,
                description,
                markdown,
                status,
                projects,
                pinned,
                assets,
                tags: { connect: tagArray },
            },
            include: { tags: true, assets: true },
        })
        .catch(async (x) => {
            console.log(x);
            return null;
        });

    if (!project) throw new ServerErrorException();

    res.json({ project });
    await revalidate(`project/${project.uuid}`);
    if (projects) await revalidate(`projects`);
};

export default postProject;
