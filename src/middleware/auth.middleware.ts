import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import WrongTokenException from "../exceptions/BadToken";
import HttpException from "../exceptions/httpExceptions";
import fs from "fs";

const cert = fs.readFileSync(`${process.cwd()}/public.pem`);

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const cookies: jwt.JwtPayload = req.signedCookies;

    if (req.headers.authorization === process.env.CLIENT_SECRET && req.method == "GET") return next();

    if (cookies && cookies.session) {
        try {
            const tokenData = jwt.verify(cookies.session, cert);
            if (tokenData) next();
            else next(new WrongTokenException());
        } catch (error) {
            res.clearCookie("session");
            next(new WrongTokenException());
        }
    } else {
        next(new HttpException(401, "Unauthorised"));
    }
}

export default authMiddleware;