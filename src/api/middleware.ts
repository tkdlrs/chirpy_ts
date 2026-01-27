import { Request, Response, NextFunction } from "express";
import { config } from "../config.js"
import { respondWithError } from "./json.js";
import {
    BadRequestError,
    UserNotAuthenticatedError,
    UserForbiddenError,
    NotFoundError,
} from "./errors.js";

export function middlewareLogResponses(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        const httpMethod = req.method;
        const url = req.url
        //
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${httpMethod} ${url} - Status: ${statusCode}`)
        }
    });
    //
    next();
}
//
export function middlewareMetricsInc(
    _: Request,
    __: Response,
    next: NextFunction,
) {
    config.fileServerHits++;
    next();
}
//
export function errorMiddleWare(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    //
    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 403;
        message = err.message;
    }
    // 500 and up
    if (statusCode >= 500) {
        console.log(err.message);
    }
    //
    respondWithError(res, statusCode, message);
}
//
