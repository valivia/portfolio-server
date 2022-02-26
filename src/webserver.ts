import NotFoundException from "./exceptions/notFound";
import express, { Application } from "express";
import logger from "morgan";
import colors from "colors";
import helmet from "helmet";
import cron from "cron";
import cookieParser from "cookie-parser";

import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import twoFaService from "./util/2fa.service";
import reminder from "./util/reminder.service";

colors.enable();
const env = process.env;

class App {
    private app: Application;

    constructor(
        controllers: Controller[],
    ) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.reminderLoop();

        twoFaService;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser(env.COOKIETOKEN));
        this.app.set("trust proxy", true);
        this.app.use(logger("short"));
        this.app.use(helmet());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Origin", `https://${process.env.CLIENT_URL}`);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

            if (req.method == "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
                res.status(200).json({});
                return;
            }
            next();
        });

        console.log(" ✓ Middleware initialized:".green.bold);
    }

    private initializeControllers(controllers: Controller[]) {
        console.log(" > Loading controllers:".green.bold);

        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
            console.log(` - Loaded controller: ${controller.path}`.cyan.italic);
        });

        console.log(" ✓ all controllers loaded:".green.bold);
    }

    private initializeErrorHandling() {
        this.app.use((_req, _res, next) => { next(new NotFoundException); });
        this.app.use(errorMiddleware);

        console.log(" ✓ Error handler initialized:".green.bold);
    }

    public getServer(): Application {
        return this.app;
    }

    public reminderLoop(): void {
        reminder().then(() => console.log("a")).catch(() => console.log("mogus"));
        new cron.CronJob("0 0 * * *", reminder, null, true).start();
    }

    public listen(): void {
        this.app.listen(env.PORT, () => {
            console.log(` > Web server ready at port ${env.PORT} - ${env.NODE_ENV}`.green.bold);
        });
    }
}

export default App;