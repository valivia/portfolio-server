import { cleanEnv, email, host, num, port, str, url } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({ choices: ["development", "test", "production"] }),

        // auth
        TFA_SECRET: str(),
        JWT_SECRET: str(),
        CLIENT_SECRET: str(),
        CLIENT_URL: url(),
        WEBHOOK_SECRET: str(),

        // web
        PORT: port(),
        COOKIETOKEN: str(),
        SESSIONLENGTH: num(),

        // db
        DATABASE_URL: url(),

        // content
        AUTHOR: str(),
        SOCIAL_INSTAGRAM: url(),

        // Email
        EMAIL_HOST: host(),
        EMAIL_PORT: num(),
        EMAIL_USER: str(),
        EMAIL_PASS: str(),
        EMAIL_FROM: str(),
        EMAIL_TARGET: email(),
    });
}

export default validateEnv;