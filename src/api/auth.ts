import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserNotAuthenticatedError } from "./errors.js";
//
import type { Request, Response } from "express";
import type { UserResponse } from "./users.js"
//
import { config } from "../config.js";
//
type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
}
//
export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        token: string;
        refreshToken: string;
    };
    //
    const params: parameters = req.body;
    // get user with email
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UserNotAuthenticatedError("incorrect email or password")
    }
    //
    const matching = await checkPasswordHash(params.password, user.hashedPassword)
    if (!matching) {
        throw new UserNotAuthenticatedError("incorrect email or password")
    }
    //
    const duration = config.jwt.defaultDuration;
    // if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    //     duration = params.expiresIn;
    // }
    const accessToken = makeJWT(user.id, duration, config.jwt.secret);
    const refreshToken = await makeRefreshToken(user.id);

    //
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: accessToken,
        refreshToken,
    } satisfies LoginResponse);
};

