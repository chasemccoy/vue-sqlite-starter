import { Router } from 'express';
import { RecordInsertSchema } from '@db/schema';
import { IdParamSchema, ListRecordsInputSchema } from '@shared/types/api';
import {
	getRecord,
	listRecords,
	upsertRecord,
	deleteRecord,
	linksForRecord,
	getRecordBySlug,
	getRecordWithOutgoingLinks,
} from '@db/queries/records';
import { getFamilyTree } from '@db/queries/tree';

export const recordRoutes = Router();

// ============================================================================
// GET
// ============================================================================

recordRoutes.get('/record/:id', async (req, res, next) => {
	try {
		const { id } = IdParamSchema.parse(req.params);
		const { outgoing_links } = req.query;

		const record = outgoing_links ? await getRecordWithOutgoingLinks(id) : await getRecord(id);

		if (!record) {
			res.status(404).send(`Record with id ${id} not found`);
			return;
		}

		res.json(record);
	} catch (error) {
		next(error);
	}
});

recordRoutes.get('/record/slug/:slug', async (req, res, next) => {
	try {
		const { slug } = req.params;
		const record = await getRecordBySlug(slug);
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

recordRoutes.get('/record/:id/tree', async (req, res, next) => {
	try {
		const { id } = IdParamSchema.parse(req.params);
		const tree = await getFamilyTree(id);
		res.json(tree);
	} catch (error) {
		next(error);
	}
});

// ============================================================================
// POST
// ============================================================================

recordRoutes.post('/records', async (req, res, next) => {
	try {
		const input = ListRecordsInputSchema.parse(req.body || {});
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
