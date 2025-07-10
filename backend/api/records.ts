import { Router } from 'express';
import { RecordInsertSchema } from '@db/schema';
import { IdParamSchema } from '@shared/types/api';
import { getRecord, upsertRecord, deleteRecord } from '@db/queries/records';

export const recordRoutes = Router();

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

// ============================================================================
// PUT
// ============================================================================

recordRoutes.put('/record', async (req, res, next) => {
  try {
    const record = RecordInsertSchema.parse(req.body);
    // @ts-expect-error - Bug with drizzle-zod
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
