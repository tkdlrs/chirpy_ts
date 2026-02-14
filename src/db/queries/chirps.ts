import { and, asc, eq } from 'drizzle-orm';
import { db } from "../index.js";
import { chirps, NewChirp, } from "../schema.js";
import { firstOrUndefined } from './utils.js';
//
export async function createChirp(chirp: NewChirp) {
    const [rows] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return rows;
}
//
export async function getChirps() {
    return db.select().from(chirps).orderBy(asc(chirps.createdAt));
}
//
export async function getChirp(id: string) {
    const rows = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));
    //
    return firstOrUndefined(rows)
}
//
export async function deleteChirp(chirpID: string, userID: string) {
    const rows = await db
        .delete(chirps)
        .where(
            and(
                eq(chirps.id, chirpID),
                eq(chirps.userId, userID)
            )
        ).returning();
    //
    return rows.length > 0;
}
//
export async function getChirpsByAuthor(authorID: string) {
    return db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, authorID))
        .orderBy(asc(chirps.createdAt));
}
//
