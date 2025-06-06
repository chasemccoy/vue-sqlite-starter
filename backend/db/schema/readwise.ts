import { int, sqliteTable, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { contentTimestamps, databaseTimestamps } from './utils';
import { records } from './records';

export const readwiseLocationEnum: [string, ...string[]] = [
  'new',
  'later',
  'shortlist',
  'archive',
  'feed',
];

export const readwiseCategoryEnum: [string, ...string[]] = [
  'article',
  'email',
  'rss',
  'highlight',
  'note',
  'pdf',
  'epub',
  'tweet',
  'video',
];

export const readwiseDocuments = sqliteTable('readwise_documents', {
  id: text().primaryKey(),
  url: text().notNull(),
  sourceUrl: text(),
  title: text(),
  author: text(),
  authorId: int().references(() => readwiseAuthors.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  source: text(),
  content: text(),
  htmlContent: text(),
  category: text({ enum: readwiseCategoryEnum }),
  location: text({ enum: readwiseLocationEnum }),
  tags: text({ mode: 'json' }).$type<string[]>(),
  siteName: text(),
  wordCount: int(),
  notes: text(),
  summary: text(),
  imageUrl: text(),
  parentId: text().references((): AnySQLiteColumn => readwiseDocuments.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  readingProgress: int(),
  publishedDate: text(),
  firstOpenedAt: text(),
  lastOpenedAt: text(),
  savedAt: text().notNull(),
  lastMovedAt: text().notNull(),
  // integrationRunId: integer('integration_run_id')
  //   .references(() => integrationRuns.id)
  //   .notNull(),
  recordId: int().references(() => records.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  deletedAt: text(),
  ...contentTimestamps,
  ...databaseTimestamps,
});

export type ReadwiseDocumentSelect = typeof readwiseDocuments.$inferSelect;
export type ReadwiseDocumentInsert = typeof readwiseDocuments.$inferInsert;

export const readwiseAuthors = sqliteTable('readwise_authors', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  origin: text(),
  recordId: int().references(() => records.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  deletedAt: text(),
  ...databaseTimestamps,
});

export type ReadwiseAuthorSelect = typeof readwiseAuthors.$inferSelect;
export type ReadwiseAuthorInsert = typeof readwiseAuthors.$inferInsert;

export const readwiseTags = sqliteTable('readwise_tags', {
  id: int().primaryKey({ autoIncrement: true }),
  tag: text().unique().notNull(),
  recordId: int().references(() => records.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  deletedAt: text(),
  ...databaseTimestamps,
});

export type ReadwiseTagSelect = typeof readwiseTags.$inferSelect;
export type ReadwiseTagInsert = typeof readwiseTags.$inferInsert;

export const readwiseDocumentTags = sqliteTable('readwise_document_tags', {
  id: int().primaryKey({ autoIncrement: true }),
  documentId: text()
    .notNull()
    .references(() => readwiseDocuments.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  tagId: int()
    .notNull()
    .references(() => readwiseTags.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  ...databaseTimestamps,
});

export type ReadwiseDocumentTagSelect = typeof readwiseDocumentTags.$inferSelect;
export type ReadwiseDocumentTagInsert = typeof readwiseDocumentTags.$inferInsert;