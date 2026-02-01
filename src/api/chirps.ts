import type { Request, Response } from "express";
//
import { respondWithJSON } from "./json.js";
import { createChirp, getChirps } from "../db/queries/chirps.js";
import { BadRequestError } from "./errors.js";
//
export async function handlerChirpsCreate(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    }
    //
    const params: parameters = req.body;
    const cleaned = validateChirp(params.body);
    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields");
    }
    //
    const chirp = await createChirp({
        body: cleaned,
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
export function validateChirp(body: string) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(
            `Chirp is too long. Max length is ${maxChirpLength}`,
        );
    }
    //
    return getCleanedBody(body);
}
//
export function getCleanedBody(strToFilter: string): string {
    const words: string[] = strToFilter.split(" ");
    const profaneWords = ["KeRfuFfLe", "Sharbert", "Fornax"].map(item => item.toLowerCase());
    //
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = (word.toLowerCase());
        if (profaneWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }
    //
    return words.join(" ");
}
//
export async function handlerChirpsIndex(_: Request, res: Response) {
    try {
        const chirps = await getChirps();
        return respondWithJSON(res, 200, chirps);
    } catch (err) {
        throw new Error("Issue getting chirps")
    }
}