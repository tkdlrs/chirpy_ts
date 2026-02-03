import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserNotAuthenticatedError } from "./errors.js";
//
import type { Request, Response } from "express";
import type { UserResponse } from "./users.js"
//
export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
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
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    } satisfies UserResponse);
};

