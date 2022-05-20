import "reflect-metadata";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("colors").enable();

import validateEnv from "./util/ValidateENV"; validateEnv();

import App from "./webserver";
import BrowseController from "./routes/gallery/gallery.controller";
import ProjectController from "./routes/project/project.controller";
import ContactController from "./routes/contact/contact.controller";
import TagsController from "./routes/tags/tags.controller";
import AuthController from "./routes/auth/auth.controller";
import ContentController from "./routes/content/content.controller";
import WebhookController from "./routes/webhook/webhook.controller";
import MailingListController from "./routes/mailing/mailing.controller";
import StatusController from "./routes/status/status.controller";

const controllers = [
    new BrowseController(),
    new ProjectController(),
    new ContactController(),
    new TagsController(),
    new AuthController(),
    new ContentController(),
    new WebhookController(),
    new MailingListController(),
    new StatusController(),
];

const app = new App(controllers);
app.listen();
