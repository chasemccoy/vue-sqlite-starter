import { sqliteTable, text, int, type AnySQLiteColumn, check } from 'drizzle-orm/sqlite-core';
import { contentTimestamps, databaseTimestamps } from './utils';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { recordTypeEnum } from '@shared/types';
import { sql } from 'drizzle-orm';

export const records = sqliteTable(
	'records',
	{
		id: int().primaryKey({ autoIncrement: true }),
		slug: text().unique().notNull(),
		type: text({ enum: recordTypeEnum }).notNull().default('artifact'),
		title: text().notNull(),
		url: text(),
		isCurated: int({ mode: 'boolean' }).notNull().default(false),
		summary: text(),
		content: text(),
		notes: text(),
		...databaseTimestamps,
		...contentTimestamps,
	},
	(table) => [
		check('title_not_empty', sql`${table.title} != ''`),
		check('slug_not_empty', sql`${table.slug} != ''`),
	],
);

// export const RecordSelectSchema = createSelectSchema(records);
export type RecordSelect = typeof records.$inferSelect;
export const RecordInsertSchema = createInsertSchema(records);
export type RecordInsert = typeof records.$inferInsert;

export const links = sqliteTable('links', {
	id: int().primaryKey({ autoIncrement: true }),
	sourceId: int()
		.references(() => records.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	targetId: int()
		.references(() => records.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	predicateId: int()
		.references(() => predicates.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
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
	...databaseTimestamps,
});

// export const PredicateSelectSchema = createSelectSchema(predicates);
// export type PredicateSelect = typeof predicates.$inferSelect;
// export const PredicateInsertSchema = createInsertSchema(predicates);
export type PredicateInsert = typeof predicates.$inferInsert;
