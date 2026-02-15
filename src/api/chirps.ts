import type { Request, Response } from "express";
//
import { respondWithError, respondWithJSON } from "./json.js";
import {
    createChirp,
    deleteChirp,
    getChirp,
    getChirps,
} from "../db/queries/chirps.js";
import {
    BadRequestError,
    NotFoundError,
    UserForbiddenError
} from "./errors.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { Chirp } from "src/db/schema.js";
//
export async function handlerChirpsCreate(req: Request, res: Response) {
    type parameters = {
        body: string;
    }
    //
    const params: parameters = req.body;
    // Check/confirm the user is who they say they are
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    //
    if (!params.body) {
        throw new BadRequestError("Missing required fields");
    }
    //
    const cleaned = validateChirp(params.body);
    const chirp = await createChirp({ body: cleaned, userId: userId });
    if (!chirp) {
        throw new Error("Couldn't create chirp");
    }
    //
    respondWithJSON(res, 201, chirp);
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
export async function handlerChirpsIndex(req: Request, res: Response) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    //
    type Sort = "asc" | "desc";
    let sort: Sort = "asc";
    let sortQuery = req.query.sort;
    if (typeof sortQuery === "string") {
        if (sortQuery === "desc") {
            sort = sortQuery;
        } else if (sortQuery === "asc") {
            sort = sortQuery;
        }
    }
    //
    const chirps = await getChirps(authorId);
    //
    const sortedChirps = chirps.sort((a: Chirp, b: Chirp) => {
        const A = new Date(a.createdAt).getTime();
        const B = new Date(b.createdAt).getTime();
        //
        if (sort === "asc") {
            if (A > B) return 1;
            if (A < B) return -1;
            return 0;
        } else if (sort === "desc") {
            if (A < B) return 1;
            if (A > B) return -1;
            return 0;
        } else {
            throw new Error("sorting went wrong")
        };
        //
    })
    //
    respondWithJSON(res, 200, sortedChirps);
}
//
export async function handlerChirpsShow(req: Request, res: Response) {
    const { chirpId } = req.params;
    try {
        const chirp = await getChirp(chirpId.toString());
        if (!chirp) {
            throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
        }
        respondWithJSON(res, 200, chirp);
        return;
    } catch (err) {
        respondWithError(res, 404, "Chirp not found");
        return;
    }
}
//
export async function handlerChirpsDelete(req: Request, res: Response) {
    let { chirpId } = req.params;
    chirpId = chirpId.toString();
    //
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    //
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }
    //
    if (chirp.userId !== userId) {
        throw new UserForbiddenError("You can't delete this chirp");
    }
    //
    const deleted = await deleteChirp(chirpId, userId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }
    //
    res.status(204).send();
}