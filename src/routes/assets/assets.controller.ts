import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import getAsssetService from "./assets.service";

class AssetController implements Controller {
    public path = "/file/:folder/:fileName";
    public router = Router();

    private getAsssetService = new getAsssetService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAsset);
    }

    private getAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            this.getAsssetService.getFile(req.params.folder, req.params.fileName, req, res, next);
        } catch (e) {
            next(e);
        }
    }
}

export default AssetController;
