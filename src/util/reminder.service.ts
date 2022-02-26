import { project_status } from "@prisma/client";
import prisma from "./db.service";
import EmailService from "./email.service";

export default async function reminder(): Promise<void> {
    const db = prisma;
    const d = new Date();
    d.setDate(d.getDate() - 30);

    const query = await db.project.findMany({ where: { updated: { lt: d }, status: project_status.in_progress }, orderBy: { updated: "desc" } });

    if (query.length === 0) return;

    let html = "<h1>Beep boop these are the projects that have not been edited for 30 days</h1>";
    html += "<ul>";
    for (const project of query) {
        html += `<li><a href="https://${process.env.CLIENT_URL}/project/${project.uuid}">${project.name}</a> - ${Math.round((Date.now() - Number(project.updated)) / (1000 * 60 * 60 * 24))} days</li>`;
    }
    html += "</ul>";

    const mailing = new EmailService();
    await mailing.sendEmail("Project Status Reminder", "a", html);
}