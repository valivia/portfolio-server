import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import prisma from "../../util/db.service";
import ProjectDeleteDto from "./delete/project.delete.dto";
import GetProjectService from "./get/get.project";
import ProjectPostDto from "./post/project.post.dto";

import multer from "multer";
import deleteProject from "./delete/project.delete";
import postProject from "./post/project.post.service";
import GetProjectsService from "./get/get.projects";
import ProjectPatchDto from "./patch/project.patch.dto";
import patchProject from "./patch/project.patch.service";
const mult = multer();

class ProjectController implements Controller {
    public path = "/project";
    public router = Router();
    public db;

    private getService = new GetProjectService();

    constructor() {
        this.db = prisma;

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.get_project);
        this.router.get(this.path, this.get_projects);

        this.router.delete(
            this.path,
            authMiddleware,
            validationMiddleware(ProjectDeleteDto),
            this.delete_project,
        );

        this.router.post(
            this.path,
            mult.single("banner"),
            authMiddleware,
            validationMiddleware(ProjectPostDto, true),
            this.post_project,
        );

        this.router.patch(
            this.path,
            authMiddleware,
            validationMiddleware(ProjectPatchDto, true),
            this.patch_project,
        );
    }

    private get_project = async (req: Request, res: Response, next: NextFunction) => {
        this.getService.main(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private get_projects = async (req: Request, res: Response, next: NextFunction) => {
        GetProjectsService(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private post_project = (req: Request, res: Response, next: NextFunction) => {
        postProject(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private patch_project = (req: Request, res: Response, next: NextFunction) => {
        patchProject(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private delete_project = (req: Request, res: Response, next: NextFunction) => {
        deleteProject(req, res, this.db).catch((e: Error) => { next(e); });
    }

}

export default ProjectController;
