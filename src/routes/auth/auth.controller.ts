import { Router, Request, Response, NextFunction } from "express";
import BadTokenException from "../../exceptions/BadToken";
import Controller from "../../interfaces/controller.interface";
import authMiddleware from "../../middleware/auth.middleware";
import twoFaService from "../../util/2fa.service";
import jwt from "jsonwebtoken";
import fs from "fs";

import ratelimit from "express-rate-limit";
import validationMiddleware from "../../middleware/validation.middleware";
import AuthDto from "./auth.dto";

const limit = ratelimit({
    windowMs: 1 * 60 * 60 * 1000,
    max: 6,
    message: "Too many attempts, try again later",
});

class AuthController implements Controller {
    public path = "/auth";
    public router = Router();

    constructor() {
        this.router.get("/qr", this.qrcode);
        this.router.post("/auth", authMiddleware, this.auth);
        this.router.post("/login", limit, validationMiddleware(AuthDto), this.login);
    }

    private auth = (_req: Request, res: Response, _next: NextFunction) => { res.sendStatus(200); }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        if (!twoFaService.validate(req.body.code)) return next(new BadTokenException());

        // json webtoken
        const key = fs.readFileSync(`${process.cwd()}/private.key`);
        const signedSession = jwt.sign({ ID: "amogus" }, key, { algorithm: "RS256", expiresIn: "2h" });

        // make cookie
        res.cookie("session", signedSession, { maxAge: 7200000, signed: true, secure: true, httpOnly: true });
        res.status(200).send("authorized");
    }

    private qrcode = async (_req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV !== "development") return next();

        res.send(await twoFaService.getQRUrl());
    }

}

export default AuthController;