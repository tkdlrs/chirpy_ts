import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { NewUser, refreshTokens, users } from "../schema.js";
import { firstOrUndefined } from "./utils.js";
import { UserNotAuthenticatedError } from '../../api/errors.js';
//
export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
//
export async function reset() {
    await db.delete(users);
}
//
export async function getUserByEmail(email: string) {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return firstOrUndefined(result);
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const token = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    const tokenResult = firstOrUndefined(token);
    const now = new Date();
    if (!tokenResult) {
        throw new UserNotAuthenticatedError("Unable to find refresh token");
    }
    if (tokenResult.revokedAt != null) {
        throw new UserNotAuthenticatedError("Refresh token has been revoked");
    }
    if (tokenResult.expiresAt < now) {
        throw new UserNotAuthenticatedError("Refresh token has expired");
    }
    //
    const result = await db.select().from(users).where(eq(users.id, tokenResult.userId));
    //
    return firstOrUndefined(result);
}