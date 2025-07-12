import { sqliteTable, text, int, check } from 'drizzle-orm/sqlite-core';
import { contentTimestamps, databaseTimestamps } from './utils';
import { createInsertSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const records = sqliteTable(
  'records',
  {
    id: int().primaryKey({ autoIncrement: true }),
    slug: text().unique().notNull(),
    title: text(),
    url: text(),
    isCurated: int({ mode: 'boolean' }).notNull().default(false),
    summary: text(),
    content: text(),
    notes: text(),
    ...databaseTimestamps,
    ...contentTimestamps,
  },
  (table) => [check('slug_not_empty', sql`${table.slug} != ''`)],
);

export type RecordSelect = typeof records.$inferSelect;
export const RecordInsertSchema = createInsertSchema(records);
export type RecordInsert = typeof records.$inferInsert;
