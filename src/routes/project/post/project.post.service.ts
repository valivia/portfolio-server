import { asset_type, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import HttpException from "../../../exceptions/httpExceptions";
import ServerErrorException from "../../../exceptions/serverError";
import ImageService from "../../../util/image.service";
import ProjectPostDto from "./project.post.dto";

const postProject = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {
    const { name, description, status, created, markdown, external_url } = req.body as ProjectPostDto;
    const projects = (req.body as ProjectPostDto).projects == "true";
    const pinned = (req.body as ProjectPostDto).pinned == "true";

    let { tags } = req.body;
    let assets = {};
    const file = req.file?.buffer;

    if (typeof tags == "string") { tags = [tags]; }

    const tagArray: { uuid: string }[] = tags.map(((x: string) => ({ uuid: x })));

    if (!file && !projects) throw new HttpException(400, "This project would be invisible");

    if (file) {
        const fileName = uuidv4();
        const imageProcessing = new ImageService(file);
        const { height, width } = await imageProcessing.getMetadata();
        assets = {
            create: {
                width,
                height,
                uuid: fileName,
                type: asset_type.image,
                display: true,
                thumbnail: true,

            },
        };

        if (imageProcessing && !await imageProcessing.makeAssets(fileName)) throw new ServerErrorException();
    }

    const project = await db.project.create({
        data: {
            created: new Date(created),
            name,
            description,
            markdown,
            status,
            projects,
            pinned,
            external_url,
            tags: {
                connect: tagArray,
            },
            assets,
        },
        include: { tags: true },
    });

    res.json({ uuid: project });
};

export default postProject;