import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import prisma from "../../util/db.service";
import GetGalleryService from "./get.gallery";

class BrowseController implements Controller {
    public path = "/gallery";
    public router = Router();
    public db;

    private getService = new GetGalleryService()

    constructor() {
        this.db = prisma;

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllProjects);
        this.router.get(this.path, this.getAllProjects);
        this.router.post(this.path, this.searchProjects);
    }

    private getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
        this.getService.main(req, res, this.db).catch((e: Error) => { next(e); });
    }

    private searchProjects(_req: Request, _res: Response, _next: NextFunction) {
        // let query = req.params.query;
    }
}

export default BrowseController;
