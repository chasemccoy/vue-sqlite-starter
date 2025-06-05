import { inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { records, type RecordInsert, type RecordSelect } from "../db/schema";

export const getRecord = (recordId: RecordSelect['id']) => {
  return db.query.records.findFirst({
    where: {
      id: recordId,
    }
  })
}

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
    // throw new TRPCError({
    //   code: 'INTERNAL_SERVER_ERROR',
    //   message: `Record upsert failed. Input data:\n\n${JSON.stringify(input, null, 2)}`,
    // });
  }

  if (modifiedRecord instanceof Error) {
    // throw new TRPCError({
    //   code: 'INTERNAL_SERVER_ERROR',
    //   message: `Record upsert failed. Input data:\n\n${JSON.stringify(input, null, 2)}`,
    // });
  }

  return modifiedRecord;
}

export const markAsCurated = async (recordIds: Array<RecordSelect['id']>) => {
  const updatedRecords = await db
    .update(records)
    .set({ isCurated: true, recordUpdatedAt: sql`(CURRENT_TIMESTAMP)` })
    .where(inArray(records.id, recordIds))
    .returning({
      id: records.id,
    });

  // if (updatedRecords.length !== recordIds.length) {
  // 	throw new TRPCError({
  // 		code: 'INTERNAL_SERVER_ERROR',
  // 		message: `Failed to update records. Input data:\n\n${JSON.stringify(input, null, 2)}`,
  // 	});
  // }

  return updatedRecords.map((r) => r.id);
}