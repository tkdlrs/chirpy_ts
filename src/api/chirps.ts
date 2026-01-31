import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";
//
export async function handlerChirpsCreate(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    }
    //
    const params: parameters = req.body;
    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields");
    }
    //
    const cleanedBody: string = chirpsValidate(params.body);
    //
    const chirp = await createChirp({
        body: cleanedBody,
        userId: params.userId
    })
    if (!chirp) {
        throw new Error("Couldn't create chirp");
    }
    //
    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId,
    });
}
//
export function chirpsValidate(body: string) {
    //
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(
            `Chirp is too long. Max length is ${maxChirpLength}`,
        );
    }
    // 'swears' check. smh 
    body = profaneFilter(body);
    // 
    return body;
}
//
export function profaneFilter(strToFilter: string): string {
    const arrWords: string[] = strToFilter.split(" ");
    const profaneWords = ["KeRfuFfLe", "Sharbert", "Fornax"].map(item => item.toLowerCase());
    //
    for (let i = 0; i < arrWords.length; i++) {
        const word = arrWords[i];
        const loweredWord = (word.toLowerCase());
        if (profaneWords.includes(loweredWord)) {
            arrWords[i] = "****";
        }
    }
    //
    return arrWords.join(" ");
}
//
