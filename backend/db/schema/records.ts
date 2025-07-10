import { sqliteTable, text, int, check, index } from 'drizzle-orm/sqlite-core';
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
  (table) => [
    check('slug_not_empty', sql`${table.slug} != ''`),
    index('records_slug_idx').on(table.slug),
    index('records_record_created_at_idx').on(table.recordCreatedAt),
    index('records_record_updated_at_idx').on(table.recordUpdatedAt),
    index('records_is_curated_idx').on(table.isCurated),
  ],
);

export type RecordSelect = typeof records.$inferSelect;
export const RecordInsertSchema = createInsertSchema(records);
export type RecordInsert = typeof records.$inferInsert;
