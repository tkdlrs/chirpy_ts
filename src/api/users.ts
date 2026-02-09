import type { Request, Response } from "express";
//
import { createUser, updateUser } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { NewUser, User } from "../db/schema.js";
import { config } from "../config.js";
//
export type UserResponse = Omit<NewUser, "hashedPassword">
//
export async function handlerUsersCreate(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    //
    const params: parameters = req.body;
    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }
    //
    const hashedPassword = await hashPassword(params.password);
    //
    const user = await createUser({
        email: params.email,
        hashedPassword,
    } satisfies NewUser);
    if (!user) {
        throw new Error("Could not create user");
    }
    //
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
};
//
export async function handlerUsersEdit(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    // check authentication - that the user is who they say 
    let userId: string = "";
    try {
        const token = getBearerToken(req);
        userId = validateJWT(token, config.jwt.secret);
    } catch (e) {
        throw new UserNotAuthenticatedError("incorrect user")
    }
    // check the request has the necessary information.
    const params: parameters = req.body;
    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }
    // allow user to update their information.
    const hashedPassword = await hashPassword(params.password);
    //
    const user = await updateUser(userId, {
        email: params.email,
        hashedPassword
    } satisfies NewUser);
    if (!user) {
        throw new Error("Could not update user")
    }
    //
    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
};
//
