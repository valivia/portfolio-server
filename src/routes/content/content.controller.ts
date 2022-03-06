import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import prisma from "../../util/db.service";

import multer from "multer";
import postContent from "../content/post/content.post.service";
import ContentPostDto from "./post/content.post.dto";
import deleteContent from "./delete/content.delete.service";
import ContentDeleteDto from "./delete/content.delete.dto";
import ContentPatchDto from "./patch/content.patch.dto";
import patchContent from "./patch/content.patch.service";
import ContentPostBannerDto from "./post/content.post.banner.dto";
import patchBanner from "./post/content.post.banner.service";
const mult = multer();

class ContentController implements Controller {
    public path = "/content";
    public router = Router();
    public db;

    constructor() {
        this.db = prisma;

        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(
            this.path,
            mult.single("image"),
            authMiddleware,
            validationMiddleware(ContentPostDto),
            this.post_content);

        this.router.patch(
            "/banner",
            authMiddleware,
            validationMiddleware(ContentPostBannerDto),
            this.post_banner);

        this.router.delete(
            this.path,
            authMiddleware,
            validationMiddleware(ContentDeleteDto),
            this.delete_content);

        this.router.patch(
            this.path,
            authMiddleware,
            validationMiddleware(ContentPatchDto),
            this.patch_content);
    }

    private post_content = (req: Request, res: Response, next: NextFunction) => {
        postContent(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private post_banner = (req: Request, res: Response, next: NextFunction) => {
        patchBanner(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private delete_content = (req: Request, res: Response, next: NextFunction) => {
        deleteContent(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private patch_content = (req: Request, res: Response, next: NextFunction) => {
        patchContent(req, res, this.db).catch((e: Error) => { next(e); });
    }

}

export default ContentController;
