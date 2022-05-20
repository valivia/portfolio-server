import { project_status } from "@prisma/client";
import { Router, Request, Response } from "express";
import Controller from "../../interfaces/controller.interface";

class StatusController implements Controller {
  public path = "/status";
  public router = Router();

  constructor() {
      this.router.get(this.path, this.getStatus);
  }

  private getStatus = async (_req: Request, res: Response) => {
      res.json(Object.values(project_status));
  };
}

export default StatusController;
