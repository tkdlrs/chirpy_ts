import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
//
export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    //
    const params: parameters = req.body;
    //
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    // 'swears' check. smh 
    params.body = profaneFilter(params.body);
    // 
    respondWithJSON(res, 200, {
        cleanedBody: params.body
    });
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