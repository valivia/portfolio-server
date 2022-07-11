import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import prisma from "../../util/db.service";

class TagsController implements Controller {
    public path = "/tags";
    public router = Router();

    constructor() {
        this.router.get(this.path, this.getTags);
    }

    private getTags = async (
        _req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const tags = await prisma.tag.findMany({
                select: {
                    uuid: true,
                    name: true,
                },
                orderBy: { name: "asc" },
            });
            res.json(tags);
        } catch (err) {
            next(err);
        }
    };
}

export default TagsController;
