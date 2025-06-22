import { eq } from 'drizzle-orm';
import { db } from '../index';
import { media, type MediaInsert, type MediaSelect } from '@db/schema';
import type { APIResponse } from '@shared/types/api';

// TODO: Combine insert and update?

export async function insertMedia(data: MediaInsert): Promise<MediaSelect> {
  const [inserted] = await db.insert(media).values(data).returning();
  return inserted;
}

export type InsertMediaAPIResponse = APIResponse<typeof insertMedia>;

export async function getMedia(id: number): Promise<MediaSelect | undefined> {
  const [result] = await db.select().from(media).where(eq(media.id, id));
  return result;
}

export async function getMediaByRecordId(recordId: number): Promise<MediaSelect[]> {
  return await db.select().from(media).where(eq(media.recordId, recordId));
}

export async function deleteMedia(id: number) {
  const [result] = await db.delete(media).where(eq(media.id, id)).returning();
  return result;
}

export type DeleteMediaAPIResponse = APIResponse<typeof deleteMedia>;

export async function updateMedia(
  id: number,
  data: Partial<MediaInsert>,
): Promise<MediaSelect | undefined> {
  const [updated] = await db.update(media).set(data).where(eq(media.id, id)).returning();
  return updated;
}
