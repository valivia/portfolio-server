import { experience_category, project_status } from "@prisma/client";
import { Router } from "express";
import Controller from "../../interfaces/controller.interface";

class EnumController implements Controller {
    public path = "/enum";
    public router = Router();

    constructor() {
        this.router.get(this.path + "/project/status", (_req, res) =>
            res.json(Object.values(project_status)),
        );

        this.router.get(this.path + "/experience/category", (_req, res) =>
            res.json(Object.values(experience_category)),
        );
    }
}

export default EnumController;
