import { isUUID } from "class-validator";
import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller.interface";
import prisma from "../../util/db.service";
import crypto from "crypto";
import BadTokenException from "../../exceptions/BadToken";
import revalidate from "../../util/revalidate.service";
import NotFoundException from "../../exceptions/notFound";

class WebhookController implements Controller {
    public path = "/webhook/:uuid";
    public router = Router();

    constructor() {
        this.router.post(this.path, this.postWebhook);
    }

    private postWebhook = async (req: Request, res: Response, next: NextFunction) => {
        const uuid = req.params.uuid;
        if (!uuid || !isUUID(uuid)) return next();

        if (!this.verifyPayload(req)) return next(new BadTokenException());

        const result = await prisma.project.update({ where: { uuid }, data: { updated: new Date() } }).catch(() => null);

        if (!result) return next(new NotFoundException("Project not found"));

        res.status(200).send("ok");
        await revalidate(`project/${uuid}`);
    }

    private verifyPayload(req: Request) {
        const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET as string);
        let self_signature = hmac.update(JSON.stringify(req.body)).digest("hex");
        self_signature = `sha256=${self_signature}`;

        const sourceSignature = req.headers["x-hub-signature-256"];
        if (!sourceSignature || typeof sourceSignature !== "string") return false;
        const source = Buffer.from(sourceSignature);
        const comparison = Buffer.from(self_signature);
        if (!crypto.timingSafeEqual(source, comparison)) return false;
        return true;
    }

}

export default WebhookController;