import { Request, Response, NextFunction } from "express";
import { config } from "../config.js"

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
export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        config.fileserverHits++;
    })
    //
    next();
}