import { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
const env = process.env;

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.initializeEmail();
    }

    private initializeEmail() {
        this.transporter = nodemailer.createTransport({
            host: env.EMAIL_HOST,
            port: Number(env.EMAIL_PORT),
            secure: true,
            debug: true,
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        });
    }

    public async sendEmail(subject: string, content: string, html?: string): Promise<string> {
        return await this.transporter.sendMail({
            from: env.EMAIL_FROM,
            to: env.EMAIL_TARGET,
            subject: subject,
            html,
            text: content,
        });
    }


}

export default EmailService;
