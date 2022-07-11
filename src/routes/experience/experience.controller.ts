import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import Controller from "../../interfaces/controller.interface";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import prisma from "../../util/db.service";
import ExperienceDeleteDto from "./delete/dto";
import deleteExperience from "./delete/service";
import getExperience from "./get/service";
import ExperiencePatchDto from "./patch/dto";
import patchExperience from "./patch/service";
import ExperiencePostDto from "./post/dto";
import postExperience from "./post/service";
const mult = multer();

class ExperienceController implements Controller {
    public path = "/experience";
    public router = Router();
    public db;

    constructor() {
        this.db = prisma;

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + "/:uuid", this.get_experience);

        this.router.get(this.path, this.get_experience);

        this.router.post(
            this.path,
            authMiddleware,
            mult.single("icon"),
            validationMiddleware(ExperiencePostDto),
            async (req, res, next) => {
                postExperience(req, res, this.db).catch((e: Error) => {
                    next(e);
                });
            },
        );

        this.router.patch(
            this.path,
            authMiddleware,
            validationMiddleware(ExperiencePatchDto),
            async (req, res, next) => {
                patchExperience(req, res, this.db).catch((e: Error) => {
                    next(e);
                });
            },
        );

        this.router.delete(
            this.path,
            authMiddleware,
            validationMiddleware(ExperienceDeleteDto),
            async (req, res, next) => {
                deleteExperience(req, res, this.db).catch((e: Error) => {
                    next(e);
                });
            },
        );
    }

    private get_experience = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        getExperience(req, res, this.db).catch((e: Error) => {
            next(e);
        });
    };
}

export default ExperienceController;
