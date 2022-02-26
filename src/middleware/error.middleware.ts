import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httpExceptions";

function errorMiddleware(error: HttpException, _req: Request, res: Response, _next: NextFunction): void {
    if (error.status !== 404 && process.env.NODE_ENV == "development") console.log(error);
    const message = !!error.status && error.message || "Something went wrong";
    const status = error.status || 500;
    res.status(status).json({ message, status });
}

export default errorMiddleware;