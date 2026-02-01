import { db } from "../index.js";
import { chirps, NewChirp, Chirp } from "../schema.js";
import { asc } from 'drizzle-orm';
//
export async function createChirp(chirp: NewChirp) {
    const [rows] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return rows;
}

//
export async function getChirps(): Promise<Chirp[]> {
    return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}