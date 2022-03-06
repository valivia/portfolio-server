import { asset_type, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import HttpException from "../../../exceptions/httpExceptions";
import ServerErrorException from "../../../exceptions/serverError";
import ImageService from "../../../util/image.service";
import revalidate from "../../../util/revalidate.service";
import ContentPostDto from "./content.post.dto";


const postContent = async (req: Request, res: Response, db: PrismaClient): Promise<void> => {

    const { uuid, display, alt, description } = req.body as ContentPostDto;

    if (!req?.file?.buffer) throw new HttpException(400, "No image attached.");

    const gallery_uuid = uuidv4();

    const imageProcessing = new ImageService(req.file.buffer);
    const { width, height } = await imageProcessing.getMetadata();

    const content = await db.asset.create({
        data: {
            width,
            height,
            description,
            alt,
            uuid: gallery_uuid,
            display: display === "true",
            project_id: uuid,
            type: asset_type.image,
        },
    });

    await db.project.update({ where: { uuid: content.project_id }, data: { updated: new Date() } });

    if (!await imageProcessing.makeAssets(gallery_uuid)) {
        throw new ServerErrorException();
    }

    res.json({ content });

    await revalidate(`project/${uuid}`);
};

export default postContent;