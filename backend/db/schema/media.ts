import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
import { databaseTimestamps } from './utils';
import { records } from './records';
import { relations } from 'drizzle-orm';

const mediaTypeEnum: [string, ...string[]] = [
  'application', // application or binary data
  'audio', // audio files
  'font', // font/typeface files
  'image', // images (jpg, png, etc)
  'message', // message data
  'model', // 3D models
  'multipart', // multipart files
  'text', // plain text, markdown, etc.
  'video', // video files
];

export const media = sqliteTable('media', {
  id: int().primaryKey({ autoIncrement: true }),
  recordId: int().references(() => records.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  url: text().notNull(),
  altText: text(),
  format: text({ enum: mediaTypeEnum }).default('application'),
  contentTypeString: text().notNull().default('application/octet-stream'),
  fileSize: int(),
  width: int(),
  height: int(),
  // versionOfMediaId: int().references((): AnySQLiteColumn => media.id, {
  //   onDelete: 'cascade',
  //   onUpdate: 'cascade',
  // }),
  ...databaseTimestamps,
});

export type MediaSelect = typeof media.$inferSelect;
export type MediaInsert = typeof media.$inferInsert;

export const mediaRelations = relations(media, ({ one }) => ({
  record: one(records, {
    fields: [media.recordId],
    references: [records.id],
  }),
}));