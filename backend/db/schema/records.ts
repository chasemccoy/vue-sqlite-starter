import { sqliteTable, text, int, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { contentTimestamps, databaseTimestamps } from './utils';
import z from 'zod/v4';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { emptyStringToNull } from '@shared/lib/formatting';

const recordTypeEnum: [string, ...string[]] = [
	'entity', // an actor in the world, has will
	'concept', // a category, idea, or abstraction
	'artifact', // physical or digital objects, content, or media
] as const;

export const RecordTypeSchema = z.enum(recordTypeEnum);
export type RecordType = z.infer<typeof RecordTypeSchema>;

export const records = sqliteTable('records', {
	id: int().primaryKey({ autoIncrement: true }),
	slug: text().unique().notNull(),
	type: text({ enum: recordTypeEnum }).default('artifact'),
	title: text().notNull(),
	url: text(),
	isCurated: int({ mode: 'boolean' }).notNull().default(false),
	summary: text(),
	content: text(),
	notes: text(),
	...databaseTimestamps,
	...contentTimestamps
});

// export const RecordSelectSchema = createSelectSchema(records);
export type RecordSelect = typeof records.$inferSelect;
export const RecordInsertSchema = createInsertSchema(records).extend({
	url: emptyStringToNull(z.url()).optional(),
});
export type RecordInsert = typeof records.$inferInsert;

export const links = sqliteTable('links', {
	id: int().primaryKey({ autoIncrement: true }),
	sourceId: int().references(() => records.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}).notNull(),
	targetId: int().references(() => records.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}).notNull(),
	predicateId: int().references(() => predicates.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}).notNull(),
	notes: text(),
	...databaseTimestamps,
});

export const LinkSelectSchema = createSelectSchema(links);
export type LinkSelect = typeof links.$inferSelect;

export const LinkInsertSchema = createInsertSchema(links);
export type LinkInsert = typeof links.$inferInsert;

const predicateTypeEnum: [string, ...string[]] = [
	'creation', // authorship, ownership …
	'containment', // has_part, sequence …
	'description', // about, tag …
	'association', // related_to, similar_to …
	'reference', // cites, responds_to …
	'identity', // instance_of, same_as …
] as const;

// export const PredicateType = z.enum(predicateTypeEnum);
// export type PredicateType = z.infer<typeof PredicateType>;

export const predicates = sqliteTable('predicates', {
	id: int().primaryKey({ autoIncrement: true }),
	slug: text().unique().notNull(),
	name: text().notNull(),
	type: text({ enum: predicateTypeEnum }).notNull(),
	role: text(),
	inverseSlug: text().references((): AnySQLiteColumn => predicates.slug, {
		onDelete: 'set null',
		onUpdate: 'cascade',
	}),
	canonical: int({ mode: 'boolean' }).notNull().default(true),
	...databaseTimestamps
});

// export const PredicateSelectSchema = createSelectSchema(predicates);
// export type PredicateSelect = typeof predicates.$inferSelect;
// export const PredicateInsertSchema = createInsertSchema(predicates);
// export type PredicateInsert = typeof predicates.$inferInsert;