import nodemailer, { SentMessageInfo } from "nodemailer";
import prisma from "./db.service";
const env = process.env;

class EmailService {
    private getTransporter() {
        return nodemailer.createTransport({
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

    public async sendEmail(receipient: string, subject: string, content: string, html?: string): Promise<SentMessageInfo> {
        const transporter = this.getTransporter();

        const response = await transporter.sendMail({
            from: env.EMAIL_FROM,
            to: receipient,
            subject: subject,
            html,
            text: content,
        });

        transporter.close();

        console.info(response);
        return response;
    }

    public async sendBulkEmail(subject: string, html: string): Promise<SentMessageInfo[]> {
        const transporter = this.getTransporter();
        const receipients = await prisma.mailing_list.findMany({ where: { verified: true }, select: { email: true } });
        const sendList = [];

        for (const receipient of receipients) {
            sendList.push(transporter.sendMail({
                from: env.EMAIL_FROM,
                to: receipient.email,
                subject: subject,
                html,
                text: html,
            }));
        }

        const responses = await Promise.all(sendList);
        transporter.close();

        return responses;
    }

}

export default EmailService;
