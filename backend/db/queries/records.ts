import { inArray, sql } from 'drizzle-orm';
import { db } from '@db/index';
import { records, type RecordInsert, type RecordSelect } from '@db/schema';
import { type APIResponse } from '@shared/types/api';

export const getRecord = (recordId: RecordSelect['id']) => {
  return db.query.records.findFirst({
    where: {
      id: recordId,
    },
  });
};

export type GetRecordAPIResponse = APIResponse<typeof getRecord>;

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

export type UpsertRecordAPIResponse = APIResponse<typeof upsertRecord>;

export const deleteRecord = async (recordIds: Array<RecordSelect['id']>) => {
  const recordsToDelete = await db.query.records.findMany({
    where: {
      id: {
        in: recordIds,
      },
    },
  });

  if (recordsToDelete.length !== recordIds.length) {
    const notFound = recordIds.filter((id) => !recordsToDelete.some((r) => r.id === id));
    // eslint-disable-next-line no-console
    console.warn(`Some records were not found: ${notFound.join(', ')}`);
  }

  return db.delete(records).where(inArray(records.id, recordIds)).returning();
};

export type DeleteRecordAPIResponse = APIResponse<typeof deleteRecord>;
