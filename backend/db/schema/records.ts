import { sqliteTable, text, int, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { contentTimestamps, databaseTimestamps } from './utils';
import { relations } from 'drizzle-orm';
import { media } from './media';

const recordTypeEnum: [string, ...string[]] = [
	'entity', // an actor in the world, has will
	'concept', // a category, idea, or abstraction
	'artifact', // physical or digital objects, content, or media
] as const;

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
	...databaseTimestamps
});

export type RecordSelect = typeof records.$inferSelect;
export type RecordInsert = typeof records.$inferInsert;

export const recordRelations = relations(records, ({ many }) => ({
	media: many(media),
	outgoingLinks: many(links, {
		relationName: 'source',
	}),
	incomingLinks: many(links, {
		relationName: 'target',
	}),
}));

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
	...contentTimestamps
});

export type LinkSelect = typeof links.$inferSelect;
export type LinkInsert = typeof links.$inferInsert;

export const linkRelations = relations(links, ({ one }) => ({
	source: one(records, {
		fields: [links.sourceId],
		references: [records.id],
		relationName: 'source',
	}),
	target: one(records, {
		fields: [links.targetId],
		references: [records.id],
		relationName: 'target',
	}),
	predicate: one(predicates, {
		fields: [links.predicateId],
		references: [predicates.id],
	}),
}));

const predicateTypeEnum: [string, ...string[]] = [
	'creation', // authorship, ownership …
	'containment', // has_part, sequence …
	'description', // about, tag …
	'association', // related_to, similar_to …
	'reference', // cites, responds_to …
	'identity', // instance_of, same_as …
] as const;

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

export type PredicateSelect = typeof predicates.$inferSelect;
export type PredicateInsert = typeof predicates.$inferInsert;

export const predicateRelations = relations(predicates, ({ one, many }) => ({
	links: many(links),
	inverse: one(predicates, {
		fields: [predicates.inverseSlug],
		references: [predicates.slug],
	}),
}));