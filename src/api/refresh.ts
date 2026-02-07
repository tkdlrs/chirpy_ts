import type { Request, Response } from "express";
//
import { getBearerToken, makeJWT } from "../auth.js";
import { getUserFromRefreshToken } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
//
import { config } from "../config.js";
import { revokeRefreshToken } from "../db/queries/refreshToken.js";
//
type response = {
    token: string;
}
//
export async function handlerRefresh(req: Request, res: Response) {
    //
    const bearerToken = getBearerToken(req);
    //
    const user = await getUserFromRefreshToken(bearerToken);
    if (!user) {
        throw new UserNotAuthenticatedError("Unable to find user with this refresh token");
    }
    //
    const duration = config.jwt.defaultDuration;
    const accessToken = makeJWT(user.id, duration, config.jwt.secret);
    //
    respondWithJSON(res, 200, {
        token: accessToken
    } satisfies response);
}
//
export async function handlerRevoke(req: Request, res: Response) {
    //
    const refreshToken = getBearerToken(req);
    //
    await revokeRefreshToken(refreshToken);
    //
    console.log('token should be revoked');
    //
    respondWithJSON(res, 204, {})
}