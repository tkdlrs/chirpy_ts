import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";
//
export async function handlerWebhook(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    if (!apiKey) {
        res.status(401).send();
        return;
    }
    if (apiKey !== config.api.polkaKey) {
        res.status(401).send();
        return;
    }
    //
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };
    //
    const params: parameters = req.body;
    //
    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    //
    const upgradedUser = await upgradeChirpyRed(req.body.data.userId);
    if (!upgradedUser) {
        res.status(404).send();
        return;
    }
    //
    res.status(204).send();
}
//
