import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import prisma from "../../util/db.service";

class TagsController implements Controller {
    public path = "/tags";
    public router = Router();

    constructor() {
        this.router.get(this.path, this.getTags);
    }


    private getTags = async (_req: Request, res: Response, next: NextFunction) => {
        res.json(await prisma.tag.findMany().catch((e: Error) => { next(e); }));
    }

}

export default TagsController;
