import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../../exceptions/httpExceptions";
import NotFoundException from "../../exceptions/notFound";
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../middleware/validation.middleware";
import prisma from "../../util/db.service";
import EmailService from "../../util/email.service";
import MailingPostDto from "./mailing.dto";

class MailingListController implements Controller {
    public path = "/mailing";
    public router = Router();
    public db;

    constructor() {
        this.db = prisma;

        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, validationMiddleware(MailingPostDto), this.addEmail);
        this.router.get(`${this.path}/unsubscribe/:uuid`, this.unsubscribe);
        this.router.get(`${this.path}/verify/:uuid`, this.verifyEmail);
        this.router.get("/bulk", () => {
            return;
            const emailService = new EmailService();
            emailService.sendBulkEmail("🦉 Test 2", "Hi ily <3 u cool as fuck");
        });

    }

    private addEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body as MailingPostDto;

            const created = await prisma.mailing_list.create({ data: { email } }).catch(() => null);

            if (!created) throw new HttpException(409, "Email already exists");

            const emailService = new EmailService();
            await emailService.sendEmail(email, "🦉 Verify your subscription.", `Please click the following link to verify your subscription: \n\n ${process.env.SERVER_URL}/mailing/verify/${created.uuid}`);
            res.send("Email sent");

        } catch (e) { next(e); }
    }

    private verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { uuid } = req.params;
            const updated = await prisma.mailing_list.update({ where: { uuid }, data: { verified: true } }).catch(() => null);

            if (!updated) throw new NotFoundException();
            res.status(200).send("Verified your email successfully");
        } catch (e) { next(e); }
    }

    private unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { uuid } = req.params;

            const deleted = await prisma.mailing_list.delete({ where: { uuid } }).catch(() => null);

            if (!deleted) throw new NotFoundException();
            res.status(200).send("Successfully unsubscribed");
        } catch (e) { next(e); }
    }
}

export default MailingListController;
