import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";


export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    //

    // //
    // let body = "";
    // //
    // req.on("data", (chunk) => {
    //     body += chunk;
    // });
    //
    // let params: parameters;
    // req.on("end", () => {
    //     try {
    //         params = JSON.parse(body);
    //     } catch (e) {
    //         respondWithError(res, 400, "Invalid JSON");
    //         return;
    //     }
    //     //
    //     const maxChirpLength = 140;
    //     if (params.body.length > maxChirpLength) {
    //         respondWithError(res, 400, "Chirp is too long");
    //         return;
    //     }
    //     //
    //     respondWithJSON(res, 200, {
    //         valid: true
    //     });
    // });
    //
    const params: parameters = req.body;
    //
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
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
    const arrBodyWords: string[] = strToFilter.split(" ");
    const profaneWords = ["KeRfuFfLe", "Sharbert", "Fornax"].map(item => item.toLowerCase());
    let cleanedString = "";
    //
    for (let i = 0; i < arrBodyWords.length; i++) {
        const word = (i === arrBodyWords.length - 1) ? arrBodyWords[i] : `${arrBodyWords[i]} `;
        // skip the ones that aren't included.
        if (!profaneWords.includes(word.trim().toLowerCase())) {
            cleanedString += word;
            continue;
        }
        cleanedString += (i === arrBodyWords.length) ? `****` : `**** `;
    }
    //
    return cleanedString;
}