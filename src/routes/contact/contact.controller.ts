import { Router, Request, Response, NextFunction } from "express";
import ServerErrorException from "../../exceptions/serverError";
import Controller from "../../interfaces/controller.interface";
import validationMiddleware from "../../middleware/validation.middleware";
import EmailService from "../../util/email.service";
import ratelimit from "express-rate-limit";
import ContactDto from "./contact.dto";

const limit = ratelimit({
    windowMs: 24 * 60 * 60 * 1000, // 12 hours
    max: 2,
    message:
        "Too many emails sent, try again tomorrow",
});

class ContactController implements Controller {
    public path = "/contact";
    public router = Router();

    constructor() {
        this.router.post(this.path, validationMiddleware(ContactDto), limit, this.contactPost);
    }

    private contactPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { firstName, lastName, email, subject, message }: ContactDto = req.body;
            const mailService = new EmailService();
            mailService.sendEmail(subject, `message:\n${message}\nsent by:\n${firstName} ${lastName}\n${email}\nIP: ${req.ip} - ${req.headers["cf-ipcountry"]}`);

            res.status(200).send("Email sent");
        } catch {
            next(new ServerErrorException());
        }
    }
}

export default ContactController;
