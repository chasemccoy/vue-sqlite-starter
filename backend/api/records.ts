import { Router } from 'express';
import { inArray, sql } from 'drizzle-orm';
import { db } from './db';
import { RecordInsertSchema, records, type RecordInsert, type RecordSelect } from '../db/schema';
import { IdParamSchema, ListRecordsInputSchema, type ListRecordsInput } from '@shared/types/api';

export const recordRoutes = Router();

export const getRecord = (recordId: RecordSelect['id']) => {
  return db.query.records.findFirst({
    where: {
      id: recordId,
    },
  });
};

export const listRecords = async (input: ListRecordsInput) => {
  const {
    filters: {
      type,
      title,
      text,
      url: domain,
      hasParent,
      minRating,
      maxRating,
      isPrivate,
      isCurated,
      hasReminder,
      hasEmbedding,
      hasMedia,
    },
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
};

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
};

const deleteRecord = async (recordIds: Array<RecordSelect['id']>) => {
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

// ============================================================================
// GET
// ============================================================================

recordRoutes.get('/record/:id', async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const record = await getRecord(id);

    if (!record) {
      res.status(404).send(`Record with id ${id} not found`);
      return;
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
});

recordRoutes.get('/record/:id/links', async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const links = await linksForRecord(id);
    res.json(links);
  } catch (error) {
    next(error);
  }
});

recordRoutes.get('/records', async (req, res, next) => {
  try {
    const input = ListRecordsInputSchema.parse(req.body);
    const records = await listRecords(input);
    res.json(records);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PUT
// ============================================================================

recordRoutes.put('/record', async (req, res, next) => {
  try {
    const record = RecordInsertSchema.parse(req.body);
    const updatedRecord = await upsertRecord(record);
    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE
// ============================================================================

recordRoutes.delete('/record/:id', async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const deletedRecords = await deleteRecord([id]);
    res.json(deletedRecords);
  } catch (error) {
    next(error);
  }
});
