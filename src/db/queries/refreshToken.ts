import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { refreshTokens, } from "../schema.js";
import type { RefreshToken, NewRefreshToken, } from "../schema.js";
import { firstOrUndefined } from "./utils.js";
//
export async function createRefreshToken(refreshToken: NewRefreshToken) {
    const [rows] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .returning();
    return rows;
}
//
export async function revokeRefreshToken(providedToken: string) {
    const now = new Date();
    return db
        .update(refreshTokens)
        .set({ revokedAt: now })
        .where(eq(refreshTokens.token, providedToken));
    //
}
//
