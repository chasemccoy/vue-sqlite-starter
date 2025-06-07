import { inArray, sql } from 'drizzle-orm';
import { db } from '@db/index';
import { records, type RecordInsert, type RecordSelect } from '@db/schema';
import { type ListRecordsInput } from '@shared/types/api';

export const getRecord = (recordId: RecordSelect['id']) => {
	return db.query.records.findFirst({
		where: {
			id: recordId,
		},
	});
};

export const listRecords = async (input: ListRecordsInput) => {
	const {
		filters: { type, title, text, url: domain, hasParent, isCurated, hasMedia },
		limit,
		offset,
		orderBy,
	} = input;

	const rows = await db.query.records.findMany({
		columns: {
			id: true,
		},
		where: {
			type,
			title:
				title === null
					? {
							isNull: true,
						}
					: title
						? {
								ilike: `%${title}%`,
							}
						: undefined,
			OR: text
				? [
						{
							content: { ilike: `%${text}%` },
						},
						{
							summary: { ilike: `%${text}%` },
						},
						{
							notes: { ilike: `%${text}%` },
						},
					]
				: undefined,
			url:
				domain === null
					? {
							isNull: true,
						}
					: domain
						? {
								ilike: `%${domain}%`,
							}
						: undefined,
			isCurated,
			...(hasParent === true
				? {
						outgoingLinks: {
							predicate: {
								type: 'containment',
							},
						},
					}
				: hasParent === false
					? {
							NOT: {
								outgoingLinks: {
									predicate: { type: 'containment' },
								},
							},
						}
					: {}),
			media: hasMedia,
		},
		limit,
		offset,
		// TODO: fix type issue
		orderBy: (records, { asc, desc }) => {
			// Map each order criteria to a sort expression
			return orderBy.map(({ field, direction }) => {
				const orderColumn = records[field];
				return direction === 'asc' ? asc(orderColumn) : desc(orderColumn);
			});
		},
	});

	return {
		ids: rows.map((row) => ({ id: row.id })),
	};
};

export const upsertRecord = async (record: RecordInsert) => {
	const [modifiedRecord] = await db
		.insert(records)
		.values(record)
		.onConflictDoUpdate({
			target: records.id,
			set: {
				...record,
				recordUpdatedAt: sql`(CURRENT_TIMESTAMP)`,
			},
		})
		.returning();

	if (!modifiedRecord) {
		throw new Error(`Record upsert failed. Input data:\n\n${JSON.stringify(record, null, 2)}`);
	}

	if (modifiedRecord instanceof Error) {
		throw new Error(`Record upsert failed. Input data:\n\n${JSON.stringify(record, null, 2)}`);
	}

	return modifiedRecord;
};

export const markAsCurated = async (recordIds: Array<RecordSelect['id']>) => {
	const updatedRecords = await db
		.update(records)
		.set({ isCurated: true, recordUpdatedAt: sql`(CURRENT_TIMESTAMP)` })
		.where(inArray(records.id, recordIds))
		.returning({
			id: records.id,
		});

	if (updatedRecords.length !== recordIds.length) {
		throw new Error(
			`Failed to update records. Input data:\n\n${JSON.stringify(recordIds, null, 2)}`,
		);
	}

	return updatedRecords.map((r) => r.id);
};

export const deleteRecord = async (recordIds: Array<RecordSelect['id']>) => {
	const recordsToDelete = await db.query.records.findMany({
		where: {
			id: {
				in: recordIds,
			},
		},
		with: {
			media: true,
		},
	});

	if (recordsToDelete.length !== recordIds.length) {
		const notFound = recordIds.filter((id) => !recordsToDelete.some((r) => r.id === id));
		console.warn(`Some records were not found: ${notFound.join(', ')}`);
	}

	return db.delete(records).where(inArray(records.id, recordIds)).returning();
};

export const linksForRecord = async (recordId: RecordSelect['id']) => {
	return db.query.records.findFirst({
		columns: {
			id: true,
		},
		where: {
			id: recordId,
		},
		with: {
			outgoingLinks: true,
			incomingLinks: true,
		},
	});
};
