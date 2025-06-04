import { sql } from "drizzle-orm";
import { text } from 'drizzle-orm/sqlite-core';

const recordCreatedAt = text('created_at')
  .notNull()
  .default(sql`(CURRENT_TIMESTAMP)`)

const recordUpdatedAt = text('updated_at')
  .notNull()
  .default(sql`(CURRENT_TIMESTAMP)`)

export const databaseTimestamps = {
  recordCreatedAt,
  recordUpdatedAt,
};