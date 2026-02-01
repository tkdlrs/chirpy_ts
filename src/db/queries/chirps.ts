import { asc, eq } from 'drizzle-orm';
import { db } from "../index.js";
import { chirps, NewChirp, Chirp } from "../schema.js";
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
export async function getChirp(chirpId: string) {
    const results = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    //
    return firstOrUndefined(results)
}